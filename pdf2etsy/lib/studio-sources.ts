import { classifySource, makeRow, normalize, type Project, type RowKind } from "./studio-model";

export type SourceEntry={file:File;path:string};
export type SourceFolder={id:string;name:string;kind:"local";entries:SourceEntry[]}|{id:string;name:string;kind:"drive";driveId:string};
export const supportedSource=(name:string)=>/\.(pdf|png|jpe?g|webp)$/i.test(name);
export const naturalOrder=(a:string,b:string)=>a.localeCompare(b,"cs",{numeric:true,sensitivity:"base"});
export const isSourceSubfolder=(name:string)=>/^(?:bw|cb|black and white|colou?ring|colou?r|barev\w*|vzory?|obtah\w*|trac\w*|levels?|stories|pribehy|info|cards?|karty|pdf|png|jpg|images?)$/.test(normalize(name));

export function catalogLocalFiles(files:File[]):SourceFolder[] {
  const entries=files.filter(f=>supportedSource(f.name)).map(file=>({file,path:file.webkitRelativePath||file.name}));
  const allFolders=entries.map(e=>e.path.split("/")[1]).filter(Boolean);
  const animalFolder=allFolders.length>0&&allFolders.every(name=>isSourceSubfolder(name)||supportedSource(name));
  const groups=new Map<string,{name:string;entries:SourceEntry[]}>();
  for(const entry of entries){
    const parts=entry.path.split("/"),hasChild=parts.length>2&&!animalFolder;
    const name=parts.length===1?"Vybrané soubory":hasChild?parts[1]:parts[0];
    const key=normalize(name),group=groups.get(key)||{name,entries:[]};
    group.entries.push({...entry,path:parts.slice(hasChild?2:1).join("/")||entry.file.name});groups.set(key,group);
  }
  return [...groups.entries()].map(([id,g])=>({id:"local:"+id,name:g.name,kind:"local" as const,entries:g.entries.sort((a,b)=>naturalOrder(a.path,b.path))})).sort((a,b)=>naturalOrder(a.name,b.name));
}

export function expandForSources(project:Project,paths:string[]):Project {
  const rows=[...project.rows];
  const labels:Partial<Record<RowKind,[string,string]>>={coloring:[project.mode==="animals"?"Omalovánka · level":"Pracovní list",project.mode==="animals"?"Level":"Worksheet"],story:["Příběh","Story"],info:["Informační karta","Fact card"],maze:["Bludiště","Maze"]};
  const required=new Map<RowKind,number>();
  for(const path of paths){const m=classifySource(path,project.mode);if(m.kind&&!["cover","contents","closing"].includes(m.kind))required.set(m.kind,Math.max(required.get(m.kind)||0,m.number||1));}
  for(const [kind,count] of required){
    const existing=rows.filter(r=>r.kind===kind).length,names=labels[kind];if(!names)continue;
    if(rows.length+Math.max(0,count-existing)>1000)throw new Error("Import by překročil 1 000 řádků. Rozděl podklady do více balíčků.");
    const last=rows.findLastIndex(r=>r.kind===kind),closing=rows.findIndex(r=>r.kind==="closing");
    const extra=Array.from({length:Math.max(0,count-existing)},(_,i)=>makeRow(kind,names[0]+" "+(existing+i+1),names[1]+" "+(existing+i+1)));
    rows.splice(last>=0?last+1:closing<0?rows.length:closing,0,...extra);
  }
  return rows.length===project.rows.length?project:{...project,rows};
}

type DropEntry={isFile:boolean;isDirectory:boolean;name:string;file?:(ok:(f:File)=>void,fail:(e:DOMException)=>void)=>void;createReader?:()=>{readEntries:(ok:(entries:DropEntry[])=>void,fail:(e:DOMException)=>void)=>void}};
export async function readDroppedFiles(data:DataTransfer):Promise<SourceEntry[]> {
  // Capture browser entries synchronously: the DataTransfer store expires after drop.
  const roots=Array.from(data.items).map(item=>(item as DataTransferItem&{webkitGetAsEntry?:()=>DropEntry|null}).webkitGetAsEntry?.()).filter(Boolean) as DropEntry[];
  const plain=Array.from(data.files);
  if(!roots.some(e=>e.isDirectory))return plain.filter(f=>supportedSource(f.name)).map(file=>({file,path:file.webkitRelativePath||file.name}));
  const result:SourceEntry[]=[];
  async function walk(entry:DropEntry,path:string,depth:number){
    if(depth>12)throw new Error("Složka je příliš hluboko vnořená (nejvýše 12 úrovní).");
    if(entry.isFile&&entry.file){if(!supportedSource(entry.name))return;const file=await new Promise<File>((resolve,reject)=>entry.file!(resolve,reject));result.push({file,path:path+file.name});if(result.length>400)throw new Error("Najednou lze importovat nejvýše 400 souborů.");}
    else if(entry.isDirectory&&entry.createReader){const reader=entry.createReader();for(;;){const batch=await new Promise<DropEntry[]>((resolve,reject)=>reader.readEntries(resolve,reject));if(!batch.length)break;for(const child of batch)await walk(child,path+entry.name+"/",depth+1);}}
  }
  for(const entry of roots)await walk(entry,"",0);
  return result.sort((a,b)=>naturalOrder(a.path,b.path));
}
