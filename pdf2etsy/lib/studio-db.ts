import { Asset, Project, uid } from "./studio-model";

const DB_NAME="paperwork-studio-v1";
let dbPromise: Promise<IDBDatabase> | undefined;
function db() {
  dbPromise ||= new Promise<IDBDatabase>((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,1);
    request.onupgradeneeded=()=>request.result.createObjectStore("projects",{keyPath:"id"});
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(new Error("Prohlížeč nedovolil uložit práci. Stáhni si zálohu projektu."));
  });
  return dbPromise;
}
export async function allProjects(): Promise<Project[]> {
  const connection=await db();
  return new Promise((resolve,reject)=>{
    const request=connection.transaction("projects").objectStore("projects").getAll();
    request.onsuccess=()=>resolve((request.result as Project[]).sort((a,b)=>b.updatedAt-a.updatedAt));
    request.onerror=()=>reject(request.error);
  });
}
export async function saveProject(project: Project): Promise<void> {
  const connection=await db();
  return new Promise((resolve,reject)=>{
    const tx=connection.transaction("projects","readwrite");
    tx.objectStore("projects").put(project);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(new Error("Uložení se nezdařilo. Může být plné úložiště prohlížeče. Stáhni zálohu projektu."));
  });
}
export async function deleteProject(id:string) {
  const connection=await db();
  return new Promise<void>((resolve,reject)=>{
    const tx=connection.transaction("projects","readwrite"); tx.objectStore("projects").delete(id);
    tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error);
  });
}
export function downloadBlob(blob:Blob,name:string) {
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
export async function backupProject(project:Project) {
  const readBlob=(blob:Blob)=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(blob);});
  const rows=[];
  for(const row of project.rows) {
    const sources:Record<string,unknown>={};
    for(const [key,source] of Object.entries(row.sources)) if(source) sources[key]={...source,blob:undefined,data:await readBlob(source.blob)};
    rows.push({...row,sources});
  }
  return {blob:new Blob([JSON.stringify({format:"paperwork",version:1,project:{...project,rows}})],{type:"application/json"}),filename:project.name.replace(/[^a-zA-Z0-9À-ž_-]/g,"_")+".paperwork"};
}
export async function restoreProject(file:File):Promise<Project> {
  if(file.size>250*1024*1024) throw new Error("Záloha je příliš velká. Maximální velikost je 250 MB.");
  let data;
  try {data=JSON.parse(await file.text());}catch{throw new Error("Soubor není platná záloha Paperwork.");}
  if(data?.format!=="paperwork"||data.version!==1||!Array.isArray(data.project?.rows)||data.project.rows.length>1000) throw new Error("Neplatný formát zálohy.");
  const project=data.project as Project;
  if(typeof project.name!=="string"||!["animals","etsy"].includes(project.mode)||!project.settings||!["A4","LETTER"].includes(project.settings.format)||!["cs","en"].includes(project.settings.language)) throw new Error("V záloze chybí nastavení projektu.");
  let total=0;
  for(const row of project.rows) {
    if(typeof row.title!=="string"||typeof row.englishTitle!=="string"||!["cover","contents","coloring","story","info","maze","custom","closing"].includes(row.kind)||!row.sources) throw new Error("Neplatný řádek v záloze.");
    row.id=uid(); row.enabled=row.enabled!==false;
    for(const [key,value] of Object.entries(row.sources)) {
      const source=value as Asset&{data:string};
      if(!["bw","trace","color"].includes(key)||typeof source.data!=="string"||!/^data:(application\/pdf|image\/png|image\/jpeg|image\/webp);base64,/.test(source.data)||!Number.isInteger(source.pages)||source.pages<1||source.pages>1000) throw new Error("Záloha obsahuje nepodporovaný zdroj.");
      const response=await fetch(source.data);source.blob=await response.blob();total+=source.blob.size;
      if(total>180*1024*1024) throw new Error("Podklady v záloze přesahují 180 MB.");
      if(typeof source.thumbnail!=="string"||!source.thumbnail.startsWith("data:image/")) source.thumbnail="";
      source.id=uid();delete (source as Partial<typeof source>).data;
    }
  }
  project.id=uid();project.updatedAt=Date.now();
  project.settings.accent=/^#[0-9a-fA-F]{6}$/.test(project.settings.accent)?project.settings.accent:"#75414b";
  project.settings.contentsStyle=project.settings.contentsStyle==="gallery"?"gallery":"list";
  for(const [key,fallback,max] of [["contentsTopPct",20,60],["contentsBottomPct",8,30]] as const){const value=Number(project.settings[key]);project.settings[key]=Number.isFinite(value)?Math.max(0,Math.min(max,value)):fallback;}
  return project;
}
