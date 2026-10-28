export type Variant = "bw" | "trace" | "color";
export type RowKind = "cover" | "contents" | "coloring" | "story" | "info" | "maze" | "custom" | "closing";
export type ExportKind = "coloring" | "tracing" | "complete";
export type Asset = {
  id: string; name: string; mime: string; blob: Blob; thumbnail: string;
  pages: number; origin: "local" | "drive" | "demo"; width?: number; height?: number;
};
export type StudioRow = {
  id: string; title: string; englishTitle: string; kind: RowKind;
  enabled: boolean; optional: boolean; sources: Partial<Record<Variant, Asset>>;
};
export type ProjectSettings = {
  format: "A4" | "LETTER"; language: "en" | "cs"; brand: boolean;
  brandName: string; accent: string; exportTitle: string; closingText: string;
};
export type Project = {
  id: string; name: string; mode: "animals" | "etsy"; rows: StudioRow[];
  settings: ProjectSettings; updatedAt: number; demo?: boolean;
};
export type PlanEntry = {
  id: string; rowId: string; title: string; subtitle: string; variant: Variant;
  source?: Asset; generated?: "cover" | "contents" | "closing"; count: number; start: number;
};
export const variantNames: Record<Variant, string> = {bw:"Omalovánka",trace:"Obtahovačka",color:"Barevný vzor"};
export const kindNames: Record<RowKind, string> = {cover:"Titulní strana",contents:"Automatický obsah",coloring:"Omalovánka",story:"Příběhový list",info:"Informační karta",maze:"Bludiště",custom:"Pracovní list",closing:"Závěrečná strana"};
export const species = ["Irbis", "Buvol", "Lemur", "Lev", "Slon", "Žirafa", "Panda", "Tygr", "Liška", "Tučňák"];
export const englishSpecies: Record<string,string> = {Irbis:"Snow Leopard",Buvol:"Buffalo",Lemur:"Lemur",Lev:"Lion",Slon:"Elephant","Žirafa":"Giraffe",Panda:"Panda",Tygr:"Tiger","Liška":"Fox","Tučňák":"Penguin"};
export const uid = () => typeof crypto.randomUUID==="function" ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,"0")).join("");
export function makeRow(kind: RowKind, title: string, englishTitle: string, optional = true): StudioRow {
  return {id:uid(),kind,title,englishTitle,enabled:true,optional,sources:{}};
}
export function makeProject(mode: Project["mode"] = "animals", name = "Irbis"): Project {
  const rows = [makeRow("cover", "Titulní strana", "Cover", false),makeRow("contents", "Obsah", "Contents", false)];
  if (mode === "animals") {
    for(let i=1;i<=5;i++) rows.push(makeRow("coloring","Omalovánka · level " + i,"Level " + i,false));
    for(let i=1;i<=12;i++) rows.push(makeRow("story","Příběh " + i,"Story " + i));
    for(let i=1;i<=3;i++) rows.push(makeRow("info","Informační karta " + i,"Fact card " + i));
    rows.push(makeRow("maze","Bludiště","Maze"));
  } else {
    for(let i=1;i<=20;i++) rows.push(makeRow("coloring","Pracovní list " + i,"Worksheet " + i,false));
  }
  rows.push(makeRow("closing","Závěrečná strana","Thank you",false));
  return {id:uid(),name,mode,rows,updatedAt:Date.now(),settings:{format:"A4",language:"en",brand:false,brandName:"",accent:"#75414b",exportTitle:englishSpecies[name] || name,closingText:""}};
}
export const isShared = (row: StudioRow) => row.kind === "info" || row.kind === "maze";
export const isBookend = (row: StudioRow) => ["cover","contents","closing"].includes(row.kind);
export function pageLabel(pages: number): string {
  return pages === 1 ? "strana" : pages > 1 && pages < 5 ? "strany" : "stran";
}
export function buildPlan(project: Project, kind: ExportKind, withColor: boolean): PlanEntry[] {
  const colored = withColor || kind === "complete";
  const lang = project.settings.language;
  const entries: PlanEntry[] = [];
  const add = (row: StudioRow, variant: Variant, source?: Asset, generated?: PlanEntry["generated"]) => {
    const suffix = isBookend(row) || isShared(row) ? "" : lang === "en"
      ? {bw:"Colouring",trace:"Tracing",color:"Colour reference"}[variant] : variantNames[variant];
    entries.push({id:row.id+"-"+variant,rowId:row.id,title:lang==="en"?row.englishTitle:row.title,subtitle:suffix,variant,source,generated,count:source?.pages || 1,start:0});
  };
  for(const row of project.rows.filter(r=>r.enabled)) {
    if(isBookend(row)) {
      const variant = colored ? "color" : "bw";
      const source = row.kind==="contents" ? undefined : row.sources[variant];
      add(row,variant,source,source?undefined:row.kind as PlanEntry["generated"]);
    } else if(isShared(row)) {
      const source = (colored ? row.sources.color : undefined) || row.sources.bw || row.sources.trace;
      if(source) add(row,source===row.sources.color?"color":"bw",source);
    } else {
      const variants: Variant[] = kind==="complete" ? ["bw","trace"] : [kind==="tracing"?"trace":"bw"];
      let any = false;
      for(const v of variants) if(row.sources[v]) {add(row,v,row.sources[v]);any=true;}
      if(colored && any && row.sources.color) add(row,"color",row.sources.color);
    }
  }
  const listed = entries.filter(e=>!isBookend(project.rows.find(r=>r.id===e.rowId)!));
  for(const entry of entries) if(entry.generated==="contents") entry.count = Math.max(1,Math.ceil(listed.length/28));
  let start = 1;
  for(const entry of entries) {entry.start=start; start+=entry.count;}
  return entries;
}
export function planWarnings(project: Project, kind: ExportKind, colored: boolean): string[] {
  const active=project.rows.filter(r=>r.enabled&&!isBookend(r)&&!isShared(r));
  const warnings: string[]=[];
  const variants:Variant[]=kind==="complete"?["bw","trace"]:[kind==="tracing"?"trace":"bw"];
  for(const v of variants) {
    const count=active.filter(r=>!r.optional&&!r.sources[v]).length;
    if(count) warnings.push(count+" základních listů nemá zdroj: "+variantNames[v].toLowerCase()+". Prázdné listy se vynechají.");
  }
  if(colored||kind==="complete") {
    const count=active.filter(r=>variants.some(v=>r.sources[v])&&!r.sources.color).length;
    if(count) warnings.push(count+" vložených listů nemá barevný vzor. Do PDF se vloží pouze jejich pracovní verze.");
  }
  return warnings;
}
export function sourceCount(project: Project) {
  return project.rows.reduce((n,r)=>n+Object.values(r.sources).length,0);
}
export function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
}
export function guessAssignment(name: string, project: Project, index: number): {rowId:string;variant:Variant;matched:boolean} {
  const text=normalize(name);
  const variant:Variant = /\b(trace|tracing|obtahovacka|obtahovacky|obtah|dotted)\b/.test(text) ? "trace"
    : /\b(color|colour|colored|colourful|barevny|barevna|barevne|barev|vzor|reference|rgb)\b/.test(text) ? "color" : "bw";
  let row:StudioRow|undefined;
  if(/\b(cover|titulka|titulni)\b/.test(text)) row=project.rows.find(r=>r.kind==="cover");
  else if(/\b(closing|zaver|zaverecna|thank)\b/.test(text)) row=project.rows.find(r=>r.kind==="closing");
  else if(/\b(maze|bludiste)\b/.test(text)) row=project.rows.find(r=>r.kind==="maze");
  else {
    const number = text.match(/(?:level|lvl|uroven|story|pribeh|card|karta|list|worksheet|info)\s*(\d+)/)?.[1] || text.match(/\b(\d{1,3})\b/)?.[1];
    const kind:RowKind = /\b(story|pribeh)\b/.test(text) ? "story" : /\b(card|karta|info|fact)\b/.test(text) ? "info" : "coloring";
    if(number) row=project.rows.filter(r=>r.kind===kind)[Number(number)-1];
    if(!row) row=project.rows.find(r=>!isBookend(r)&&text.includes(normalize(r.title)));
  }
  const matched=!!row;
  row ||= project.rows.filter(r=>!isBookend(r))[index % Math.max(1,project.rows.length-3)];
  return {rowId:row?.id || project.rows[0].id,variant,matched};
}
