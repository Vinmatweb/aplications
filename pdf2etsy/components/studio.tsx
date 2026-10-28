"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, BookOpen, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Copy, Download, ExternalLink, Eye, FileText, Files, FolderOpen, GripVertical, ImagePlus, Layers3, Link2, Loader2, Menu, MoreHorizontal, Package, Paintbrush, PawPrint, Pencil, Plus, ScanLine, Search, Settings2, ShieldCheck, Sparkles, Trash2, Upload, WandSparkles, X } from "lucide-react";
import { Asset, ExportKind, PlanEntry, Project, RowKind, StudioRow, Variant, buildPlan, englishSpecies, guessAssignment, isBookend, isShared, kindNames, makeProject, makeRow, pageLabel, planWarnings, sourceCount, species, uid, variantNames } from "@/lib/studio-model";
import { allProjects, backupProject, deleteProject, downloadBlob, restoreProject, saveProject } from "@/lib/studio-db";
import { demoAsset, prepareAsset } from "@/lib/studio-files";
import { isStaticHosting } from "@/lib/studio-runtime";

type ModalName="new"|"settings"|"import"|"drive"|"review"|"gallery"|"help"|"add"|"row"|"manage"|"download"|null;
type Assignment={file:File;rowId:string;variant:Variant;matched:boolean;skip?:boolean};
type Target={rowId:string;variant:Variant};
const kinds:ExportKind[]=["coloring","tracing","complete"];
const exportNames:Record<ExportKind,string>={coloring:"Omalovánky",tracing:"Obtahovačky",complete:"Kompletní balíček"};
const ACCEPT="application/pdf,image/png,image/jpeg,image/webp,.pdf,.png,.jpg,.jpeg,.webp";

function Modal({title,description,children,onClose,wide=false}:{title:string;description?:string;children:React.ReactNode;onClose:()=>void;wide?:boolean}) {
  const ref=useRef<HTMLDivElement>(null),onCloseRef=useRef(onClose);onCloseRef.current=onClose;
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement;
    const old=document.body.style.overflow;document.body.style.overflow="hidden";
    ref.current?.focus();
    const handle=(e:KeyboardEvent)=>{
      if(e.key==="Escape")onCloseRef.current();
      if(e.key==="Tab") {
        const elements=ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]');
        if(!elements?.length)return;
        const first=elements[0],last=elements[elements.length-1];
        if(e.shiftKey&&(document.activeElement===first||document.activeElement===ref.current)){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    };
    document.addEventListener("keydown",handle);
    return()=>{document.body.style.overflow=old;document.removeEventListener("keydown",handle);previous?.focus();};
  },[]);
  return <div className="modalBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={"modal "+(wide?"wide":"")}><div className="modalHead"><div><div className="eyebrow">PAPERWORK STUDIO</div><h2>{title}</h2>{description&&<p>{description}</p>}</div><button className="iconButton" aria-label="Zavřít" onClick={onClose}><X size={20}/></button></div>{children}</div></div>;
}
function Toggle({checked,onChange,label,disabled=false}:{checked:boolean;onChange:(value:boolean)=>void;label:string;disabled?:boolean}) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={()=>onChange(!checked)} className={"toggle "+(checked?"on":"")}><span/></button>;
}
function CoverMini({name,colored=true}:{name:string;colored?:boolean}) {
  return <div className={"coverMini "+(!colored?"mono":"")}><div className="miniKicker">LITTLE PAGES.<br/>BIG DISCOVERIES.</div><h3>{name||"Your next adventure"}</h3><span className="miniSubtitle">An activity book for little explorers</span><div className="miniArt"><svg viewBox="0 0 200 105" aria-hidden="true"><path d="M3 99 66 20 123 99M83 99 151 3 198 99" fill="none" stroke="currentColor" strokeWidth=".8"/><path d="m51 39 15-19 16 22-16-5Z" fill="currentColor" opacity=".1"/></svg><PawPrint strokeWidth={1.3}/></div><div className="miniBottom">Learn. Create. Explore.</div></div>;
}
function AssetPreview({asset}:{asset:Asset}) {
  const [url,setUrl]=useState("");
  useEffect(()=>{const value=URL.createObjectURL(asset.blob);setUrl(value);return()=>URL.revokeObjectURL(value);},[asset]);
  return asset.mime==="application/pdf"?<iframe className="pdfPreview" title={asset.name} src={url}/>:<img className="imagePreview" alt={asset.name} src={url}/>;
}
function SourceCell({row,variant,onUpload,onDrive,onPreview,onRemove,busy,span=false}:{row:StudioRow;variant:Variant;onUpload:()=>void;onDrive:()=>void;onPreview:(asset:Asset)=>void;onRemove:()=>void;busy:boolean;span?:boolean}) {
  const [over,setOver]=useState(false);
  const source=row.sources[variant];
  const generated=isBookend(row);
  return <div className={"sourceSlot "+(span?"sharedSlot ":"")+(over?"dragOver ":"")+(source?"filled ":"")+(generated?"generatedSlot ":"")+(variant==="color"?"colorSlot":"")}
    onDragOver={e=>{e.preventDefault();e.stopPropagation();setOver(true);}}
    onDragLeave={()=>setOver(false)}
    onDrop={e=>{e.preventDefault();e.stopPropagation();setOver(false);if(e.dataTransfer.files.length)window.dispatchEvent(new CustomEvent("paperwork-drop",{detail:{files:Array.from(e.dataTransfer.files),rowId:row.id,variant}}));}}>
    {busy?<div className="slotLoading"><Loader2 className="spin" size={20}/><span>Načítám…</span></div>:source?<><button className="assetMain" onClick={()=>onPreview(source)} aria-label={"Náhled: "+source.name}><div className="assetThumb">{source.thumbnail?<img src={source.thumbnail} alt=""/>:<FileText size={23}/>}</div><span className="assetText"><strong title={source.name}>{source.name}</strong><span>{source.mime==="application/pdf"?"PDF · "+source.pages+" "+pageLabel(source.pages):"Obrázek"}{source.origin==="demo"?" · ukázka":""}</span></span><span className="assetCheck"><Check size={11}/></span></button><div className="assetActions"><button title="Nahradit soubor" aria-label={"Nahradit "+source.name} onClick={onUpload}><Upload size={13}/></button><button title="Odebrat soubor" aria-label={"Odebrat "+source.name} onClick={onRemove}><X size={13}/></button></div></>:<><button className="emptySource" onClick={onUpload}><span className="slotIcon">{generated?<WandSparkles size={16}/>:<Plus size={17}/>}</span><span>{generated?"Automatická šablona":"Přetáhnout soubor"}<small>{generated?"nebo vložit vlastní":"PDF, PNG, JPG, WebP"}</small></span></button><button className="slotDrive" title="Import z Google Drive" aria-label={"Google Drive: "+row.title+", "+variantNames[variant]} onClick={onDrive}><DriveIcon/></button></>}
  </div>;
}
function DriveIcon(){return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 3 6 0 8 14-3 5H5L2 17 10 3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="m8 3 8 14H2m6-7-6 10m14-3 3 5" stroke="currentColor" strokeWidth="1.4"/></svg>;}

export default function Studio() {
  const [project,setProject]=useState<Project|null>(null);
  const [projects,setProjects]=useState<Project[]>([]);
  const [ready,setReady]=useState(false);
  const [saved,setSaved]=useState<"saved"|"saving"|"error">("saved");
  const [modal,setModal]=useState<ModalName>(null),[assetPreview,setAssetPreview]=useState<Asset|null>(null);
  const [readyFile,setReadyFile]=useState<{url:string;name:string;pages?:number;size:number}|null>(null);
  const [toast,setToast]=useState<{message:string;error?:boolean}|null>(null);
  const [filter,setFilter]=useState("all"),[search,setSearch]=useState(""),[missingOnly,setMissingOnly]=useState(false);
  const [exportKind,setExportKind]=useState<ExportKind>("coloring"),[withColor,setWithColor]=useState(false);
  const [busy,setBusy]=useState(""),[progress,setProgress]=useState(0),[busyCell,setBusyCell]=useState("");
  const [newName,setNewName]=useState(""),[newMode,setNewMode]=useState<Project["mode"]>("animals");
  const [assignments,setAssignments]=useState<Assignment[]>([]);
  const [driveTarget,setDriveTarget]=useState<Target>({rowId:"",variant:"bw"}),[driveUrl,setDriveUrl]=useState(""),[driveError,setDriveError]=useState("");
  const [rowMenu,setRowMenu]=useState<string|null>(null),[editingRow,setEditingRow]=useState("");
  const [addKind,setAddKind]=useState<RowKind>("coloring"),[addCount,setAddCount]=useState(1);
  const [mobileMenu,setMobileMenu]=useState(false),[gallerySearch,setGallerySearch]=useState("");
  const uploadRef=useRef<HTMLInputElement>(null),bulkRef=useRef<HTMLInputElement>(null),folderRef=useRef<HTMLInputElement>(null),restoreRef=useRef<HTMLInputElement>(null);
  const uploadTarget=useRef<Target|null>(null),current=useRef<Project|null>(null),busyRef=useRef("");
  current.current=project;busyRef.current=busy;
  const notify=useCallback((message:string,error=false)=>setToast({message,error}),[]);
  useEffect(()=>{if(toast){const id=setTimeout(()=>setToast(null),6000);return()=>clearTimeout(id);}},[toast]);
  useEffect(()=>()=>{if(readyFile)URL.revokeObjectURL(readyFile.url);},[readyFile]);
  useEffect(()=>{
    let mounted=true;
    allProjects().then(async list=>{
      if(!mounted)return;
      if(!list.length){const initial=makeProject();await saveProject(initial);list=[initial];}
      if(mounted){setProjects(list);const selected=localStorage.getItem("paperwork-current");setProject(list.find(p=>p.id===selected)||list[0]);setReady(true);}
    }).catch(e=>{if(mounted){const initial=makeProject();setProject(initial);setProjects([initial]);setReady(true);setSaved("error");notify(e.message,true);}});
    return()=>{mounted=false;};
  },[notify]);
  const persist=useCallback(async (p:Project)=>{
    try {await saveProject(p);setProjects(list=>[p,...list.filter(i=>i.id!==p.id)]);if(current.current?.id===p.id&&current.current.updatedAt===p.updatedAt)setSaved("saved");}
    catch(e){setSaved("error");notify(e instanceof Error?e.message:"Uložení se nezdařilo.",true);}
  },[notify]);
  useEffect(()=>{
    if(!ready||!project)return;
    setSaved("saving");
    localStorage.setItem("paperwork-current",project.id);
    const id=setTimeout(()=>persist(project),450);
    return()=>clearTimeout(id);
  },[project,ready,persist]);
  useEffect(()=>{
    const onHide=()=>{if(document.visibilityState==="hidden"&&current.current)void persist(current.current);};
    document.addEventListener("visibilitychange",onHide);
    return()=>document.removeEventListener("visibilitychange",onHide);
  },[persist]);
  const update=useCallback((fn:(p:Project)=>Project)=>setProject(p=>p?{...fn(p),updatedAt:Date.now()}:p),[]);
  const updateRow=(id:string,fn:(row:StudioRow)=>StudioRow)=>update(p=>({...p,rows:p.rows.map(r=>r.id===id?fn(r):r)}));
  async function switchProject(next:Project) {
    if(busy)return;
    if(current.current)await persist(current.current);
    setProject(next);setSearch("");setFilter("all");setMissingOnly(false);setMobileMenu(false);setModal(null);
  }
  async function createNew(mode=newMode,name=newName) {
    if(busy)return;
    const next=makeProject(mode,name.trim()||"Nový balíček");
    if(project)await persist(project);
    await persist(next);setProject(next);setModal(null);setFilter("all");setSearch("");setMissingOnly(false);setMobileMenu(false);notify("Nový balíček je připravený.");
  }
  async function loadDemo() {
    if(busy)return;
    setBusy("Připravuji ukázkový balíček");setProgress(0);
    try {
      if(project)await persist(project);
      const next=makeProject("animals","Irbis — ukázka");next.demo=true;next.settings.exportTitle="Snow Leopard";
      const activities=next.rows.filter(r=>r.kind==="coloring");
      for(let i=0;i<activities.length;i++)for(const variant of ["bw","trace","color"] as Variant[]) {
        activities[i].sources[variant]=await demoAsset(variant,i+1);setProgress(Math.round((i*3+["bw","trace","color"].indexOf(variant)+1)/15*100));
      }
      await persist(next);setProject(next);setModal(null);setFilter("all");setMissingOnly(false);setWithColor(true);notify("Ukázka je připravená. Všechny podklady můžeš nahradit vlastními.");
    }catch(e){notify(e instanceof Error?e.message:"Ukázku se nepodařilo otevřít.",true);}
    finally{setBusy("");}
  }
  async function attachFiles(files:File[],target:Target) {
    const snapshot=current.current;if(!snapshot||busyRef.current)return;
    if(files.length>1)notify("Do jedné buňky vkládám první soubor. Pro více souborů použij hromadný import.");
    const file=files[0];if(!file)return;
    setBusyCell(target.rowId+"-"+target.variant);setBusy("Načítám "+file.name);
    try {
      const asset=await prepareAsset(file);
      const size=snapshot.rows.reduce((n,r)=>n+Object.values(r.sources).reduce((m,a)=>m+(a?.blob.size||0),0),0);
      const replaced=snapshot.rows.find(r=>r.id===target.rowId)?.sources[target.variant]?.blob.size||0;
      if(size-replaced+asset.blob.size>180*1024*1024)throw new Error("Balíček překročil 180 MB podkladů. Zmenši obrázky nebo rozděl projekt.");
      update(p=>p.id===snapshot.id?{...p,rows:p.rows.map(r=>r.id===target.rowId?{...r,sources:{...r.sources,[target.variant]:asset}}:r)}:p);
      notify(file.name+" je vložený.");
    }catch(e){notify(e instanceof Error?e.message:"Soubor se nepodařilo vložit.",true);}
    finally{setBusy("");setBusyCell("");}
  }
  useEffect(()=>{
    const drop=(event:Event)=>{const detail=(event as CustomEvent).detail;void attachFiles(detail.files,{rowId:detail.rowId,variant:detail.variant});};
    const prevent=(e:DragEvent)=>e.preventDefault();
    window.addEventListener("paperwork-drop",drop);window.addEventListener("dragover",prevent);window.addEventListener("drop",prevent);
    return()=>{window.removeEventListener("paperwork-drop",drop);window.removeEventListener("dragover",prevent);window.removeEventListener("drop",prevent);};
  });
  const pick=(target:Target)=>{uploadTarget.current=target;uploadRef.current?.click();};
  const openDrive=(target?:Target)=>{
    if(!project)return;setDriveTarget(target||{rowId:project.rows.find(r=>!isBookend(r)&&!r.sources.bw)?.id||project.rows[0].id,variant:"bw"});setDriveUrl("");setDriveError("");setModal("drive");
  };
  function acceptBulk(files:File[]) {
    if(!project||!files.length)return;
    const accepted=files.filter(f=>/\.(pdf|png|jpe?g|webp)$/i.test(f.name));
    if(!accepted.length){notify("Vyber soubory PDF, PNG, JPG nebo WebP.",true);return;}
    if(accepted.length>400){notify("Najednou lze importovat nejvýše 400 souborů.",true);return;}
    setAssignments(accepted.map((file,i)=>({file,...guessAssignment((file.webkitRelativePath||file.name),project,i)})));setModal("import");
  }
  async function importAssigned() {
    if(!project||busy)return;
    const projectId=project.id,results:{rowId:string;variant:Variant;asset:Asset}[]=[],errors:string[]=[];
    let totalBytes=project.rows.reduce((n,r)=>n+Object.values(r.sources).reduce((m,a)=>m+(a?.blob.size||0),0),0);
    const pending=assignments.filter(a=>!a.skip);
    if(!pending.length)return;
    setBusy("Importuji podklady");setProgress(0);
    for(let i=0;i<pending.length;i++){
      const assignment=pending[i];
      try{
        const asset=await prepareAsset(assignment.file);
        const row=project.rows.find(r=>r.id===assignment.rowId);
        const variant=assignment.variant==="trace"&&row&&(isBookend(row)||isShared(row))?"bw":assignment.variant;
        const old=results.findLast(x=>x.rowId===assignment.rowId&&x.variant===variant)?.asset||row?.sources[variant];
        const candidate=totalBytes+asset.blob.size-(old?.blob.size||0);
        if(candidate>180*1024*1024)throw new Error("Překročen limit 180 MB podkladů v projektu.");
        totalBytes=candidate;
        results.push({rowId:assignment.rowId,variant,asset});
      }catch(e){errors.push(e instanceof Error?e.message:assignment.file.name+": nelze vložit");}
      setProgress(Math.round((i+1)/pending.length*100));
    }
    update(p=>p.id===projectId?{...p,rows:p.rows.map(r=>{const next={...r,sources:{...r.sources}};for(const result of results)if(result.rowId===r.id)next.sources[result.variant]=result.asset;return next;})}:p);
    setBusy("");setModal(null);notify("Vloženo "+results.length+" z "+pending.length+" souborů."+(errors.length?" "+errors[0]:""),errors.length>0);
  }
  async function importDrive() {
    if(isStaticHosting()){setDriveError("Na veřejném webu vlož soubor stažený z Disku přes hromadný import.");return;}
    if(!project||busy)return;const projectId=project.id;
    setBusy("Načítám soubor z Google Drive");setDriveError("");
    try{
      const response=await fetch("/api/drive",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:driveUrl})});
      if(!response.ok){const result=await response.json() as {error?:string};throw new Error(result.error||"Soubor nelze načíst.");}
      const blob=await response.blob(),name=response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1]||"google-drive.pdf";
      const asset=await prepareAsset(new File([blob],name,{type:blob.type}),"drive");
      const total=project.rows.reduce((n,r)=>n+Object.values(r.sources).reduce((m,a)=>m+(a?.blob.size||0),0),0);
      const targetRow=project.rows.find(r=>r.id===driveTarget.rowId);
      const variant=driveTarget.variant==="trace"&&targetRow&&(isBookend(targetRow)||isShared(targetRow))?"bw":driveTarget.variant;
      if(total-(targetRow?.sources[variant]?.blob.size||0)+asset.blob.size>180*1024*1024)throw new Error("Projekt překročil limit 180 MB podkladů.");
      update(p=>p.id===projectId?{...p,rows:p.rows.map(r=>r.id===driveTarget.rowId?{...r,sources:{...r.sources,[variant]:asset}}:r)}:p);
      setModal(null);notify("Soubor z Google Drive je vložený.");
    }catch(e){setDriveError(e instanceof Error?e.message:"Import se nezdařil.");}
    finally{setBusy("");}
  }
  const plan=useMemo(()=>project?buildPlan(project,exportKind,withColor):[],[project,exportKind,withColor]);
  const pages=plan.reduce((n,p)=>n+p.count,0);
  const activityCount=project?plan.filter(p=>!isBookend(project.rows.find(r=>r.id===p.rowId)!)).length:0;
  const allAssets=useMemo(()=>project?project.rows.flatMap(row=>Object.entries(row.sources).map(([variant,asset])=>({row,variant:variant as Variant,asset:asset!}))):[],[project]);
  async function runExport() {
    if(!project||busy)return;
    setBusy("Sestavuji PDF balíček");setProgress(0);
    try{
      const {generatePdf}=await import("@/lib/studio-pdf");
      const result=await generatePdf(project,exportKind,withColor,(done,total)=>setProgress(Math.round(done/total*100)));
      setReadyFile({url:URL.createObjectURL(result.blob),name:result.filename,pages:result.pages,size:result.blob.size});setModal("download");
    }catch(e){notify(e instanceof Error?e.message:"PDF se nepodařilo vytvořit.",true);}
    finally{setBusy("");}
  }
  async function doBackup() {
    if(!project||busy)return;
    setBusy("Připravuji zálohu");
    try{const result=await backupProject(project);setReadyFile({url:URL.createObjectURL(result.blob),name:result.filename,size:result.blob.size});setModal("download");}
    catch{notify("Zálohu se nepodařilo vytvořit.",true);}
    finally{setBusy("");}
  }
  async function doRestore(file?:File) {
    if(!file||busy)return;setBusy("Obnovuji zálohu");
    try{const next=await restoreProject(file);if(project)await persist(project);await persist(next);setProject(next);setModal(null);notify("Záloha byla obnovená jako samostatný balíček.");}
    catch(e){notify(e instanceof Error?e.message:"Zálohu nelze obnovit.",true);}
    finally{setBusy("");}
  }
  function addRows() {
    if(!project)return;const count=Math.max(1,Math.min(100,Math.floor(addCount)||1));
    if(project.rows.length+count>1000){notify("Jeden projekt může mít nejvýše 1 000 řádků.",true);return;}
    const start=project.rows.filter(r=>r.kind===addKind).length;
    const labels:Partial<Record<RowKind,[string,string]>>={coloring:[project.mode==="animals"?"Omalovánka · level":"Pracovní list",project.mode==="animals"?"Level":"Worksheet"],story:["Příběh","Story"],info:["Informační karta","Fact card"],maze:["Bludiště","Maze"],custom:["Pracovní list","Worksheet"]};
    const names=labels[addKind]||labels.custom!;
    const newRows=Array.from({length:count},(_,i)=>makeRow(addKind,names[0]+" "+(start+i+1),names[1]+" "+(start+i+1)));
    update(p=>{const rows=[...p.rows];const closing=rows.findIndex(r=>r.kind==="closing");rows.splice(closing<0?rows.length:closing,0,...newRows);return {...p,rows};});
    setModal(null);setFilter("all");notify("Přidáno "+count+" řádků.");
  }
  function moveRow(id:string,direction:number) {
    update(p=>{const rows=[...p.rows];const index=rows.findIndex(r=>r.id===id),target=index+direction;if(target>=0&&target<rows.length&&!isBookend(rows[target]))[rows[index],rows[target]]=[rows[target],rows[index]];return {...p,rows};});setRowMenu(null);
  }
  const closeModal=()=>{if(!busy)setModal(null);};
  if(!ready||!project)return <div className="loadingScreen"><div className="brand"><span className="brandMark"><Files size={22}/></span>paperwork<span className="brandDot">.</span></div><Loader2 size={24} className="spin"/><span>Otevírám tvůj pracovní prostor…</span></div>;
  const sources=sourceCount(project);
  const activeRows=project.rows.filter(r=>!isBookend(r)&&r.enabled);
  const completed=activeRows.filter(r=>Object.keys(r.sources).length>0).length;
  const visibleRows=project.rows.filter(r=>(filter==="all"||(filter==="coloring"?r.kind==="coloring":filter==="story"?r.kind==="story":!["coloring","story"].includes(r.kind)))&&(!search||(r.title+" "+r.englishTitle).toLowerCase().includes(search.toLowerCase()))&&(!missingOnly||(!isBookend(r)&&(!r.sources.bw||!r.sources.trace||!r.sources.color))));
  const warnings=planWarnings(project,exportKind,withColor);
  const editing=project.rows.find(r=>r.id===editingRow);
  const formatLabel=project.settings.format==="LETTER"?"US Letter":"A4";
  const staticWeb=isStaticHosting();
  const coverSource=project.rows.find(r=>r.kind==="cover")?.sources[withColor||exportKind==="complete"?"color":"bw"];
  return <div className="studioShell">
    <input ref={uploadRef} type="file" accept={ACCEPT} className="hiddenInput" onChange={e=>{if(e.target.files&&uploadTarget.current)void attachFiles(Array.from(e.target.files),uploadTarget.current);e.target.value="";}}/>
    <input ref={bulkRef} type="file" multiple accept={ACCEPT} className="hiddenInput" onChange={e=>{acceptBulk(Array.from(e.target.files||[]));e.target.value="";}}/>
    <input ref={folderRef} type="file" multiple className="hiddenInput" {...({webkitdirectory:""} as React.InputHTMLAttributes<HTMLInputElement>)} onChange={e=>{acceptBulk(Array.from(e.target.files||[]));e.target.value="";}}/>
    <input ref={restoreRef} type="file" accept=".paperwork,.json" className="hiddenInput" onChange={e=>{void doRestore(e.target.files?.[0]);e.target.value="";}}/>
    {mobileMenu&&<div className="sidebarVeil" onClick={()=>setMobileMenu(false)}/>}
    <aside className={"sidebar "+(mobileMenu?"mobileOpen":"")}>
      <a href="./" className="brand" aria-label="Paperwork studio"><span className="brandMark"><Files size={22} strokeWidth={1.8}/></span>paperwork<span className="brandDot">.</span></a>
      <div className="workspaceLabel">TVŮJ KREATIVNÍ PROSTOR</div>
      <nav className="mainNav">
        <button className="navItem active" onClick={()=>{setModal(null);setMobileMenu(false);}}><Layers3 size={18}/>Moje balíčky<span className="navCount">{projects.length}</span></button>
        <button className="navItem" onClick={()=>{setGallerySearch("");setModal("gallery");setMobileMenu(false);}}><FolderOpen size={18}/>Knihovna zdrojů</button>
        <button className="navItem" onClick={()=>{setModal("settings");setMobileMenu(false);}}><Settings2 size={18}/>Nastavení exportu</button>
      </nav>
      <div className="projectListHead"><span>ROZPRACOVÁNO</span><button className="iconButton" title="Nový balíček" aria-label="Nový balíček" disabled={!!busy} onClick={()=>{setNewName("");setNewMode(project.mode);setModal("new");}}><Plus size={16}/></button></div>
      <div className="projectList">{projects.slice(0,7).map(p=><button disabled={!!busy} className={"projectItem "+(p.id===project.id?"selected":"")} key={p.id} onClick={()=>void switchProject(p)}><span className={"projectDot "+(p.mode==="etsy"?"orange":"")}/><span>{p.name}</span>{p.id===project.id&&<ChevronRight size={13}/>}</button>)}</div>
      <button className="textButton manageButton" onClick={()=>setModal("manage")}>Spravovat balíčky <ArrowRight size={13}/></button>
      <div className="sidebarNote"><div className="noteArt"><PawPrint size={30} strokeWidth={1.3}/><Sparkles size={14}/></div><strong>Malé listy.<br/>Velké objevy.</strong><p>Tvůj další nápad začíná<br/>právě tady.</p></div>
      <div className="sidebarBottom"><button onClick={()=>setModal("help")}><CircleHelp size={17}/>Jak to funguje<ChevronRight size={14}/></button><div className="profile"><span>JM</span><div><strong>Tvůj pracovní prostor</strong><small>PDF studio · první verze</small></div><ShieldCheck size={16}/></div></div>
    </aside>
    <div className="mainShell">
      <header className="topbar"><div className="breadcrumb"><button className="iconButton mobileMenuButton" aria-label="Otevřít nabídku" onClick={()=>setMobileMenu(true)}><Menu size={20}/></button><span>Pracovní prostor</span><ChevronRight size={13}/><strong>{project.name}</strong></div><div className={"saveStatus "+(saved==="error"?"errorText":"")}>{saved==="saving"?<Loader2 size={14} className="spin"/>:saved==="saved"?<CheckCircle2 size={14}/>:<CircleHelp size={14}/>}<span>{saved==="saving"?"Ukládám…":saved==="saved"?"Uloženo v prohlížeči":"Uložení selhalo"}</span></div><button className="topHelp" onClick={()=>setModal("help")} aria-label="Nápověda"><CircleHelp size={18}/></button></header>
      <main className="mainContent">
        <div className="pageHeading"><div><div className="eyebrow"><span/> OD NÁPADU K HOTOVÉMU PDF</div><h1>Z podkladů hotový balíček<span>.</span></h1><p>Vlož své listy. Vyber variantu. A pošli do světa další dobrodružství.</p></div><div className="headingActions"><button className="button" disabled={!!busy} onClick={()=>setModal("review")}><Eye size={16}/>Náhled pořadí</button><button className="button primary" disabled={!!busy||!activityCount} onClick={()=>setModal("review")}><Download size={16}/>Exportovat PDF</button></div></div>
        <section className="projectBar">
          <div className="animalField"><div className="animalIcon"><PawPrint size={23} strokeWidth={1.5}/></div><div><label htmlFor="animal">PRO KOHO TVOŘÍME?</label><div className="animalInput"><input id="animal" aria-label="Název zvířete nebo balíčku" list="animal-options" value={project.name} maxLength={90} onChange={e=>{const name=e.target.value;update(p=>({...p,name,settings:{...p.settings,exportTitle:englishSpecies[name]||name}}));}}/><ChevronDown size={15}/></div><datalist id="animal-options">{species.map(s=><option key={s} value={s}/>)}</datalist></div></div>
          <div className="barSeparator"/>
          <div className="modeField"><span className="fieldLabel">TYP BALÍČKU</span><div className="segmented"><button className={project.mode==="animals"?"selected":""} disabled={!!busy} onClick={()=>{if(project.mode!=="animals"){const existing=projects.find(p=>p.mode==="animals"&&p.name===project.name);if(existing)void switchProject(existing);else void createNew("animals",project.name);}}}><PawPrint size={14}/>International Days Animals</button><button className={project.mode==="etsy"?"selected":""} disabled={!!busy} onClick={()=>{if(project.mode!=="etsy"){const existing=projects.find(p=>p.mode==="etsy"&&p.name===project.name);if(existing)void switchProject(existing);else void createNew("etsy",project.name);}}}><Package size={14}/>Etsy mega balíček</button></div></div>
          <button className="button driveButton" disabled={!!busy} onClick={()=>openDrive()}><DriveIcon/>Z Google Drive</button>
        </section>
        {project.demo?<div className="demoBanner"><Sparkles size={16}/><span><strong>Prohlížíš ukázkový balíček.</strong> Ilustrační podklady slouží k vyzkoušení exportů.</span><button onClick={()=>{setNewName("");setModal("new");}}>Založit vlastní<ArrowRight size={14}/></button></div>:<div className="introStrip"><span><span className="tinyStep">1</span>Vlož podklady</span><span className="introDash"/><span><span className="tinyStep">2</span>Zkontroluj pořadí</span><span className="introDash"/><span><span className="tinyStep">3</span>Stáhni hotové PDF</span><button disabled={!!busy} onClick={()=>void loadDemo()}><Sparkles size={14}/>Vyzkoušet s ukázkou<ArrowRight size={13}/></button></div>}
        <div className="workspaceGrid">
          <section className="tableSection">
            <div className="sectionHeading"><div><h2>Stránky balíčku <span>{project.rows.length}</span></h2><p>Vše na jednom místě. Přesně ve tvém pořadí.</p></div><button className="button small" disabled={!!busy} onClick={()=>{setAssignments([]);setModal("import");}}><Upload size={14}/>Hromadně nahrát</button></div>
            <div className="tableCard">
              <div className="tableToolbar"><div className="tableTabs">{[{id:"all",label:"Všechny",count:project.rows.length},{id:"coloring",label:"Omalovánky",count:project.rows.filter(r=>r.kind==="coloring").length},{id:"story",label:"Příběhy",count:project.rows.filter(r=>r.kind==="story").length},{id:"other",label:"Ostatní",count:project.rows.filter(r=>!["coloring","story"].includes(r.kind)).length}].filter(t=>t.id!=="story"||t.count).map(tab=><button className={filter===tab.id?"selected":""} onClick={()=>setFilter(tab.id)} key={tab.id}>{tab.label}<span>{tab.count}</span></button>)}</div><button className={"filterButton "+(missingOnly?"active":"")} aria-label="Zobrazit pouze neúplné řádky" aria-pressed={missingOnly} title="Pouze neúplné řádky" onClick={()=>setMissingOnly(!missingOnly)}><Settings2 size={15}/></button></div>
              <div className="tableSearch"><Search size={14}/><input aria-label="Hledat pracovní list" placeholder="Najít pracovní list…" value={search} onChange={e=>setSearch(e.target.value)}/><span>{completed} / {activeRows.length} listů má podklady</span></div>
              <div className="tableScroll">
                <div className="worksheetTable" role="table" aria-label="Stránky balíčku">
                  <div className="tableColumns" role="row"><span role="columnheader">#</span><span role="columnheader">PRACOVNÍ LIST</span><span role="columnheader"><span className="columnDot bw"/>ČERNOBÍLÁ</span><span role="columnheader"><span className="columnDot trace"/>OBTAHOVAČKA</span><span role="columnheader"><span className="columnDot color"/>BAREVNÝ VZOR</span><span/></div>
                  {visibleRows.map(row=>{
                    const index=project.rows.indexOf(row),bookend=isBookend(row),shared=isShared(row),menu=rowMenu===row.id;
                    return <div className={"worksheetRow "+(bookend?"bookendRow ":"")+(!row.enabled?"excludedRow":"")} role="row" key={row.id}>
                      <div className="orderCell" role="cell"><span>{String(index+1).padStart(2,"0")}</span><label className="rowCheckbox" title={row.enabled?"Vynechat z exportu":"Zařadit do exportu"}><input aria-label={"Zařadit: "+row.title} type="checkbox" checked={row.enabled} onChange={e=>updateRow(row.id,r=>({...r,enabled:e.target.checked}))}/></label></div>
                      <div className="rowTitle" role="cell"><div><span className={"rowKindIcon "+(bookend?"special":"")}>{row.kind==="cover"?<BookOpen size={17}/>:row.kind==="contents"?<Files size={17}/>:row.kind==="closing"?<Sparkles size={17}/>:shared?<FileText size={16}/>:row.kind==="story"?<BookOpen size={16}/>:<Paintbrush size={16}/>}</span><input aria-label={"Název řádku "+(index+1)} value={row.title} maxLength={120} onChange={e=>updateRow(row.id,r=>({...r,title:e.target.value,englishTitle:e.target.value}))}/></div><small>{row.kind==="contents"?"Čísla stran se dopočítají":row.kind==="cover"||row.kind==="closing"?"Šablona nebo vlastní soubor":shared?"Společné pro oba typy":row.optional?"Volitelný list":row.englishTitle}</small></div>
                      {row.kind==="contents"?<div className="autoContents" role="cell"><span><WandSparkles size={16}/></span><div><strong>Obsah se sestaví automaticky</strong><small>Podle vložených listů a čísel stran ve zvoleném exportu.</small></div><span className="autoBadge">AUTO</span></div>:<>
                        <SourceCell row={row} variant="bw" span={shared} busy={busyCell===row.id+"-bw"} onUpload={()=>pick({rowId:row.id,variant:"bw"})} onDrive={()=>openDrive({rowId:row.id,variant:"bw"})} onPreview={setAssetPreview} onRemove={()=>updateRow(row.id,r=>{const sources={...r.sources};delete sources.bw;return {...r,sources};})}/>
                        {!shared&&(bookend?<div className="borrowCell"><Link2 size={14}/><span>Stejné jako ČB</span></div>:<SourceCell row={row} variant="trace" busy={busyCell===row.id+"-trace"} onUpload={()=>pick({rowId:row.id,variant:"trace"})} onDrive={()=>openDrive({rowId:row.id,variant:"trace"})} onPreview={setAssetPreview} onRemove={()=>updateRow(row.id,r=>{const sources={...r.sources};delete sources.trace;return {...r,sources};})}/>)}
                        <SourceCell row={row} variant="color" busy={busyCell===row.id+"-color"} onUpload={()=>pick({rowId:row.id,variant:"color"})} onDrive={()=>openDrive({rowId:row.id,variant:"color"})} onPreview={setAssetPreview} onRemove={()=>updateRow(row.id,r=>{const sources={...r.sources};delete sources.color;return {...r,sources};})}/>
                      </>}
                      <div className="rowMenuWrap" role="cell"><button className="iconButton" aria-label={"Možnosti: "+row.title} onClick={()=>setRowMenu(menu?null:row.id)}><MoreHorizontal size={17}/></button>{menu&&<><div className="menuDismiss" onClick={()=>setRowMenu(null)}/><div className="rowDropdown"><button onClick={()=>{setEditingRow(row.id);setModal("row");setRowMenu(null);}}><Pencil size={14}/>Název v PDF</button>{!bookend&&<><button disabled={index<3} onClick={()=>moveRow(row.id,-1)}><ArrowUp size={14}/>Posunout nahoru</button><button disabled={index>=project.rows.length-2} onClick={()=>moveRow(row.id,1)}><ArrowDown size={14}/>Posunout dolů</button><button onClick={()=>{update(p=>{const rows=[...p.rows];rows.splice(index+1,0,{...row,id:uid(),sources:{...row.sources},title:row.title+" · kopie"});return {...p,rows};});setRowMenu(null);}}><Copy size={14}/>Duplikovat řádek</button><button className="dangerText" onClick={()=>{update(p=>({...p,rows:p.rows.filter(r=>r.id!==row.id)}));setRowMenu(null);}}><Trash2 size={14}/>Odstranit řádek</button></>}</div></>}</div>
                    </div>;
                  })}
                  {!visibleRows.length&&<div className="tableEmpty"><Search size={24}/><strong>Tady žádné listy nejsou.</strong><p>Změň hledání nebo přidej nový řádek.</p><button className="textButton" onClick={()=>{setSearch("");setFilter("all");setMissingOnly(false);}}>Zobrazit všechny listy</button></div>}
                </div>
              </div>
              <div className="tableFooter"><button className="addRowButton" disabled={!!busy} onClick={()=>{setAddCount(1);setModal("add");}}><Plus size={16}/>Přidat řádky</button><span>Prázdné listy se při exportu vynechají.</span><span className="fileCount"><Files size={13}/>{sources} souborů</span></div>
            </div>
            <div className="belowTable"><ShieldCheck size={15}/><span>Tvoje soubory zůstávají v tomto prohlížeči. Pro přenos nebo jistotu si stáhni zálohu.</span><button onClick={()=>void doBackup()} disabled={!!busy}>Stáhnout zálohu<Download size={13}/></button></div>
          </section>
          <aside className="exportPanel">
            <div className="exportPanelHeading"><div className="exportIcon"><Package size={19}/></div><div><h2>Tvůj balíček</h2><p>Poslední krok k dobrodružství</p></div></div>
            <div className="coverPreviewWrap">{coverSource?.thumbnail?<div className="coverSourcePreview"><img src={coverSource.thumbnail} alt="Titulní strana balíčku"/></div>:<CoverMini name={project.settings.exportTitle||project.name} colored={withColor||exportKind==="complete"}/>}<span className="coverPreviewCaption">{coverSource?"Vlastní titulka · první strana":"Ilustrační náhled automatické titulky"}</span></div>
            <div className="exportPanelBody"><div className="panelLabel">CO CHCEŠ EXPORTOVAT?</div><div className="exportOptions">{kinds.map(kind=>{const optionPlan=buildPlan(project,kind,withColor);const count=optionPlan.reduce((n,e)=>n+e.count,0);return <button key={kind} className={"exportOption "+(exportKind===kind?"selected":"")} aria-pressed={exportKind===kind} onClick={()=>setExportKind(kind)}><span className="radioCircle">{exportKind===kind&&<span/>}</span><span><strong>{exportNames[kind]}</strong><small>{kind==="complete"?"Omalovánka + obtahovačka + vzor":kind==="tracing"?"Pracovní listy k obtahování":"Černobílé pracovní listy"}</small></span><span className="optionCount">{count}</span></button>;})}</div>
              <div className="colorToggleRow"><div><strong>Přidat barevné vzory</strong><small>Vždy za odpovídající list</small></div><Toggle checked={withColor||exportKind==="complete"} disabled={exportKind==="complete"} onChange={setWithColor} label="Přidat barevné vzory"/></div>
              <div className="exportFormat"><span>FORMÁT PAPÍRU</span><div>{(["A4","LETTER"] as const).map(f=><button className={project.settings.format===f?"selected":""} key={f} onClick={()=>update(p=>({...p,settings:{...p.settings,format:f}}))}>{f==="LETTER"?"US Letter":"A4"}</button>)}</div></div>
              <button className="brandingLink" onClick={()=>setModal("settings")}><Settings2 size={14}/><span>{project.settings.brand?(project.settings.brandName||"Branding zapnutý"):"Bez přidaného brandingu"}</span><ChevronRight size={13}/></button>
              <div className="exportSummary"><div><span>Výsledný balíček</span><strong>{pages} <small>{pageLabel(pages)}</small></strong></div><div className="summaryTags"><span>{formatLabel}</span><span>{project.settings.language.toUpperCase()}</span><span>PDF</span></div></div>
              <button className="button primary exportAction" disabled={!!busy||!activityCount} onClick={()=>setModal("review")}><Download size={16}/>Zkontrolovat a exportovat<ArrowRight size={15}/></button>
              <div className="panelHint">{activityCount?<><CheckCircle2 size={12}/>Obsah i pořadí sestavíme za tebe.</>:<><ImagePlus size={13}/>Vlož první pracovní list a můžeš exportovat.</>}</div>
            </div>
            <div className="exportTip"><span><Sparkles size={16}/></span><p><strong>Jeden podklad, více možností.</strong><br/>Mezi exporty můžeš přepínat. Své soubory stačí vložit jednou.</p></div>
          </aside>
        </div>
        <footer className="workspaceFooter"><span>Vytvořeno pro malé objevitele. A velké nápady.</span><span>paperwork studio <span>✦</span></span></footer>
      </main>
    </div>

    {modal==="new"&&<Modal title="Nové dobrodružství" description="Začni čistou šablonou nebo si vyzkoušej hotovou ukázku." onClose={closeModal}><div className="modalBody"><label className="formField">Název zvířete nebo balíčku<input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Například Irbis, Buvol, Lesní zvířata…" maxLength={90}/></label><label className="formField">Šablona<select value={newMode} onChange={e=>setNewMode(e.target.value as Project["mode"])}><option value="animals">International Days Animals · 5 úrovní, 12 příběhů, 3 karty</option><option value="etsy">Etsy mega balíček · 20 pracovních listů</option></select></label><div className="infoBox"><Sparkles size={17}/><p>Titulku, obsah a závěrečnou stránku připravíme automaticky. Vlastní grafiku můžeš kdykoliv vložit.</p></div></div><div className="modalFooter"><button className="button" disabled={!!busy} onClick={()=>void loadDemo()}>Vyzkoušet ukázku</button><button className="button primary" disabled={!!busy} onClick={()=>void createNew()}><Plus size={16}/>Vytvořit balíček</button></div></Modal>}
    {modal==="settings"&&<Modal title="Ať je balíček opravdu tvůj" description="Nastavení platí pro právě otevřený balíček a ukládá se průběžně." onClose={closeModal}><div className="modalBody">
      <label className="formField">Název na titulce a v záhlaví obsahu<input value={project.settings.exportTitle} maxLength={140} onChange={e=>update(p=>({...p,settings:{...p.settings,exportTitle:e.target.value}}))}/></label>
      <div className="formGrid"><label className="formField">Jazyk generovaných stránek<select value={project.settings.language} onChange={e=>update(p=>({...p,settings:{...p.settings,language:e.target.value as "en"|"cs"}}))}><option value="en">Angličtina · pro Etsy</option><option value="cs">Čeština</option></select></label><label className="formField">Formát papíru<select value={project.settings.format} onChange={e=>update(p=>({...p,settings:{...p.settings,format:e.target.value as "A4"|"LETTER"}}))}><option value="A4">A4 · 210 × 297 mm</option><option value="LETTER">US Letter · 8.5 × 11 in</option></select></label></div>
      <div className="settingsToggle"><div><strong>Přidat branding při exportu</strong><p>Vyhradí okraj pro název značky a číslo strany.<br/>Pro už obrandované podklady ho nech vypnutý.</p></div><Toggle checked={project.settings.brand} onChange={value=>update(p=>({...p,settings:{...p.settings,brand:value}}))} label="Přidat branding při exportu"/></div>
      <div className="formGrid"><label className="formField">Název značky nebo Etsy obchodu<input value={project.settings.brandName} placeholder="Tvoje značka" maxLength={100} onChange={e=>update(p=>({...p,settings:{...p.settings,brandName:e.target.value}}))}/></label><label className="formField">Barva automatických stránek<div className="colorInput"><input type="color" value={project.settings.accent} onChange={e=>update(p=>({...p,settings:{...p.settings,accent:e.target.value}}))}/><span>{project.settings.accent.toUpperCase()}</span></div></label></div>
      <label className="formField">Vlastní text na závěrečné stránce<textarea rows={3} placeholder={project.settings.language==="en"?"Every little discovery counts.\nSee you on the next adventure.":"Každý malý objev se počítá.\nTěšíme se na další společné dobrodružství."} value={project.settings.closingText} maxLength={1000} onChange={e=>update(p=>({...p,settings:{...p.settings,closingText:e.target.value}}))}/></label><p className="formHint">Jazyk mění pouze automatické stránky. Texty v obrázcích a PDF se nepřekládají. Názvy listů pro obsah upravíš v nabídce řádku.</p>
    </div><div className="modalFooter"><span className="inlineSaved"><CheckCircle2 size={14}/>Ukládá se automaticky</span><button className="button primary" onClick={closeModal}>Hotovo<Check size={16}/></button></div></Modal>}
    {modal==="import"&&<Modal title="Podklady na jedno nahrání" description="Podle názvů souborů navrhneme řádek a variantu. Před vložením můžeš vše upravit." onClose={closeModal} wide><div className="modalBody">
      <div className="bulkDrop" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();acceptBulk(Array.from(e.dataTransfer.files));}}><div className="bulkIcon"><Upload size={25}/></div><strong>Přetáhni sem obrázky nebo PDF</strong><p>Vyber více souborů nebo celou staženou složku z Google Drive.</p><div><button className="button primary" disabled={!!busy} onClick={()=>bulkRef.current?.click()}><Files size={15}/>Vybrat soubory</button><button className="button" disabled={!!busy} onClick={()=>folderRef.current?.click()}><FolderOpen size={15}/>Vybrat složku</button></div><small>PDF, PNG, JPG, WebP · do 40 MB na soubor</small></div>
      <div className="namingHint"><WandSparkles size={16}/><span>Například <code>irbis_level_1_bw.png</code>, <code>irbis_level_1_trace.pdf</code>, <code>irbis_story_2_color.jpg</code></span></div>
      {!!assignments.length&&<><div className="importListHead"><strong>{assignments.length} souborů k přiřazení</strong><span>Stejná buňka: poslední soubor nahradí předchozí.</span></div><div className="assignmentList">{assignments.map((a,i)=><div className={"assignmentRow "+(a.skip?"skipped":"")} key={i}><input type="checkbox" aria-label={"Importovat "+a.file.name} checked={!a.skip} onChange={e=>setAssignments(list=>list.map((x,j)=>i===j?{...x,skip:!e.target.checked}:x))}/><div className="assignmentFile"><FileText size={16}/><span title={a.file.name}><strong>{a.file.name}</strong><small>{a.matched?"Rozpoznáno podle názvu":"Zkontroluj navržené přiřazení"}{project.rows.find(r=>r.id===a.rowId)?.sources[a.variant]?" · nahradí stávající":""}</small></span></div><select aria-label={"Řádek pro "+a.file.name} value={a.rowId} onChange={e=>setAssignments(list=>list.map((x,j)=>i===j?{...x,rowId:e.target.value}:x))}>{project.rows.filter(r=>r.kind!=="contents").map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select><select aria-label={"Varianta pro "+a.file.name} value={a.variant} onChange={e=>setAssignments(list=>list.map((x,j)=>i===j?{...x,variant:e.target.value as Variant}:x))}><option value="bw">Černobílá</option><option value="trace">Obtahovačka</option><option value="color">Barevný vzor</option></select></div>)}</div></>}
    </div><div className="modalFooter"><span className="formHint">Víc stránek v PDF? Zachováme je všechny.</span><button className="button primary" disabled={!!busy||!assignments.some(a=>!a.skip)} onClick={()=>void importAssigned()}><Upload size={16}/>Vložit {assignments.filter(a=>!a.skip).length||""} souborů</button></div></Modal>}
    {modal==="drive"&&!staticWeb&&<Modal title="Soubor z Google Drive" description="Vlož odkaz na veřejně sdílený obrázek nebo PDF." onClose={closeModal}><div className="modalBody"><div className="driveNotice"><DriveIcon/><p><strong>Import přes sdílený odkaz</strong><br/>Soubor musí být dostupný komukoli s odkazem. Přímé procházení soukromého Disku a produkční tabulky zatím není zapojené.</p></div><label className="formField">Odkaz na konkrétní soubor<input type="url" autoFocus value={driveUrl} onChange={e=>setDriveUrl(e.target.value)} placeholder="https://drive.google.com/file/d/…/view"/></label><div className="formGrid"><label className="formField">Pracovní list<select value={driveTarget.rowId} onChange={e=>setDriveTarget(t=>({...t,rowId:e.target.value}))}>{project.rows.filter(r=>r.kind!=="contents").map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></label><label className="formField">Varianta<select value={driveTarget.variant} onChange={e=>setDriveTarget(t=>({...t,variant:e.target.value as Variant}))}><option value="bw">Černobílá</option><option value="trace">Obtahovačka</option><option value="color">Barevný vzor</option></select></label></div>{driveError&&<div className="errorBox">{driveError}</div>}<p className="formHint">Soukromé soubory nebo celou složku stáhni z Disku a vlož přes hromadný import. Import odkazu podporuje soubory do 25 MB.</p></div><div className="modalFooter"><button className="button" onClick={()=>{setAssignments([]);setModal("import");}}>Nahrát stažené soubory</button><button className="button primary" disabled={!!busy||!driveUrl.trim()} onClick={()=>void importDrive()}>{busy?<Loader2 size={16} className="spin"/>:<Link2 size={16}/>}Načíst soubor</button></div></Modal>}
    {modal==="drive"&&staticWeb&&<Modal title="Podklady z Google Drive" description="Na veřejném webu pracujeme se soubory uloženými v tvém počítači." onClose={closeModal}><div className="modalBody"><div className="driveNotice"><DriveIcon/><p><strong>Stáhnout z Disku → vložit do balíčku</strong><br/>V Disku vyber obrázky, PDF nebo celou složku a stáhni je. ZIP nejdřív rozbal. Potom vše vlož přes hromadný import — podle názvů souborů navrhneme přiřazení.</p></div><div className="helpStep"><span>1</span><div><h3>Stáhni vybrané podklady</h3><p>V Google Drive klikni pravým tlačítkem na soubory nebo složku a vyber Stáhnout.</p></div></div><div className="helpStep"><span>2</span><div><h3>Vlož soubory do aplikace</h3><p>Přetáhni je do buněk nebo použij hromadný import. Vybranou místní složku umíme přiřadit podle názvů.</p></div></div><p className="formHint">Přímé načtení odkazu a produkční tabulka na této veřejné adrese zatím nejsou zapojené. Podklady se ukládají pouze v prohlížeči.</p></div><div className="modalFooter"><a className="button" href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener noreferrer"><ExternalLink size={15}/>Otevřít Google Drive</a><button className="button primary" onClick={()=>{setAssignments([]);setModal("import");}}><Upload size={15}/>Nahrát stažené podklady</button></div></Modal>}
    {modal==="review"&&<Modal title="Než půjde balíček do světa" description="Toto je přesné pořadí stránek ve výsledném PDF. Prázdné a vypnuté řádky se vynechají." onClose={closeModal} wide><div className="modalBody"><div className="reviewControls"><div className="segmented">{kinds.map(k=><button key={k} className={exportKind===k?"selected":""} disabled={!!busy} onClick={()=>setExportKind(k)}>{exportNames[k]}</button>)}</div><div className="reviewColor"><span>Včetně vzorů</span><Toggle checked={withColor||exportKind==="complete"} disabled={!!busy||exportKind==="complete"} label="Včetně barevných vzorů" onChange={setWithColor}/></div></div>{!activityCount?<div className="emptyState"><ImagePlus size={32}/><h3>Nejdřív vlož pracovní list</h3><p>Pro zvolenou variantu zatím nemáš žádné podklady.</p><button className="button" onClick={()=>{setAssignments([]);setModal("import");}}>Nahrát podklady</button></div>:<>{warnings.length>0&&<div className="warningBox"><CircleHelp size={17}/><div>{warnings.map(w=><p key={w}>{w}</p>)}</div></div>}<div className="planList">{plan.map(entry=><div className="planItem" key={entry.id}><span className="planNumber">{entry.start}{entry.count>1?"–"+(entry.start+entry.count-1):""}</span><div className={"planThumb "+entry.variant}>{entry.source?.thumbnail?<img src={entry.source.thumbnail} alt=""/>:entry.generated==="cover"?<BookOpen size={21}/>:entry.generated==="contents"?<Files size={21}/>:<Sparkles size={21}/>}</div><div><strong>{entry.title}</strong><small>{entry.generated?"Automaticky vytvořená strana":entry.subtitle||"Společný list"}{entry.source?.pages&&entry.source.pages>1?" · "+entry.source.pages+" stran v PDF":""}</small></div><span className={"variantPill "+entry.variant}>{entry.generated?"Šablona":entry.variant==="color"?"Vzor":entry.variant==="trace"?"Obtahovačka":"Černobílá"}</span></div>)}</div></>}</div><div className="modalFooter"><div className="reviewTotal"><strong>{pages} {pageLabel(pages)}</strong><span>{formatLabel} · {project.settings.language.toUpperCase()} · PDF</span></div><button className="button primary" disabled={!!busy||!activityCount} onClick={()=>void runExport()}>{busy?<Loader2 size={16} className="spin"/>:<Download size={16}/>}Vytvořit PDF{busy?" · "+progress+" %":""}</button></div></Modal>}
    {modal==="gallery"&&<Modal title="Knihovna podkladů" description={"Všechny soubory vložené v balíčku "+project.name+"."} onClose={closeModal} wide><div className="modalBody"><div className="gallerySearch"><Search size={17}/><input placeholder="Hledat podle názvu souboru nebo listu…" aria-label="Hledat v knihovně zdrojů" value={gallerySearch} onChange={e=>setGallerySearch(e.target.value)}/></div>{!allAssets.length?<div className="emptyState"><FolderOpen size={34}/><h3>Tvůj prostor pro nápady</h3><p>Vlož první podklady a najdeš je všechny tady.</p><button className="button primary" onClick={()=>{setAssignments([]);setModal("import");}}>Nahrát podklady</button></div>:<div className="assetGallery">{allAssets.filter(a=>(a.asset.name+a.row.title).toLowerCase().includes(gallerySearch.toLowerCase())).map(({asset,row,variant})=><button className="galleryCard" key={row.id+variant} onClick={()=>setAssetPreview(asset)}><div>{asset.thumbnail?<img src={asset.thumbnail} alt=""/>:<FileText size={40}/>}<span className={"variantPill "+variant}>{variant==="color"?"Vzor":variant==="trace"?"Obtahovačka":"ČB"}</span></div><strong>{row.title}</strong><small>{asset.name}</small></button>)}</div>}</div><div className="modalFooter"><span className="formHint">{sources} souborů · ukládáno v tomto prohlížeči</span><button className="button" onClick={()=>{setAssignments([]);setModal("import");}}><Plus size={15}/>Přidat podklady</button></div></Modal>}
    {modal==="help"&&<Modal title="Od prvního listu k hotovému PDF" onClose={closeModal}><div className="modalBody helpBody"><div className="helpStep"><span>1</span><div><h3>Vyber balíček a vlož podklady</h3><p>Do buněk přetáhni PDF nebo obrázky. Víc souborů najednou přiřadíš přes hromadný import. Vícestránkové PDF se vloží celé.</p></div></div><div className="helpStep"><span>2</span><div><h3>Zvol variantu a pořadí</h3><p>Omalovánky používají ČB sloupec, obtahovačky svůj sloupec. S barevnými vzory: pracovní list → vzor. Kompletní: omalovánka → obtahovačka → vzor. Informační karty a bludiště se vkládají jednou.</p></div></div><div className="helpStep"><span>3</span><div><h3>Zkontroluj a stáhni PDF</h3><p>Obsah se dopočítá včetně všech stránek PDF. Titulku a closing můžeš nechat na šabloně. ČB export barvy obrázků nepřevádí — vlož skutečně černobílé podklady.</p></div></div><div className="infoBox"><ShieldCheck size={18}/><p>Balíčky jsou uložené v tomto prohlížeči, bez synchronizace mezi zařízeními. Před smazáním dat prohlížeče si stáhni zálohu. {staticWeb?"Podklady z Google Drive vlož po stažení do počítače.":"Google Drive zatím funguje přes veřejný odkaz nebo staženou složku."}</p></div></div><div className="modalFooter"><button className="button" onClick={()=>void doBackup()}><Download size={15}/>Stáhnout zálohu</button><button className="button primary" onClick={closeModal}>Jdu tvořit<ArrowRight size={15}/></button></div></Modal>}
    {modal==="add"&&<Modal title="Pro další nápady je vždy místo" description="Nové řádky vložíme před závěrečnou stránku." onClose={closeModal}><div className="modalBody"><label className="formField">Typ pracovních listů<select value={addKind} onChange={e=>setAddKind(e.target.value as RowKind)}><option value="coloring">Omalovánky / pracovní listy</option><option value="story">Příběhové listy</option><option value="info">Informační karty</option><option value="maze">Bludiště</option><option value="custom">Vlastní položky</option></select></label><label className="formField">Kolik řádků přidat?<input type="number" min={1} max={100} value={addCount} onChange={e=>setAddCount(Number(e.target.value))}/></label><div className="quickCounts">{[1,5,10,20,80].map(n=><button className={addCount===n?"selected":""} key={n} onClick={()=>setAddCount(n)}>+ {n}</button>)}</div></div><div className="modalFooter"><span className="formHint">Až 100 řádků najednou.</span><button className="button primary" onClick={addRows}><Plus size={15}/>Přidat řádky</button></div></Modal>}
    {modal==="row"&&editing&&<Modal title="Názvy pracovního listu" description="Tyto názvy se používají v automatickém obsahu podle jazyka exportu." onClose={closeModal}><div className="modalBody"><label className="formField">Český název / název v tabulce<input value={editing.title} maxLength={120} onChange={e=>updateRow(editing.id,r=>({...r,title:e.target.value}))}/></label><label className="formField">Anglický název pro Etsy<input value={editing.englishTitle} maxLength={120} onChange={e=>updateRow(editing.id,r=>({...r,englishTitle:e.target.value}))}/></label></div><div className="modalFooter"><span className="inlineSaved"><CheckCircle2 size={14}/>Ukládá se automaticky</span><button className="button primary" onClick={closeModal}>Hotovo<Check size={15}/></button></div></Modal>}
    {modal==="manage"&&<Modal title="Tvoje rozpracované balíčky" description="Každý balíček má vlastní tabulku, zdroje a nastavení." onClose={closeModal}><div className="modalBody"><div className="manageList">{projects.map(p=><div key={p.id}><span className="manageIcon"><Package size={20}/></span><button className="manageProjectName" disabled={!!busy} onClick={()=>void switchProject(p)}><strong>{p.name}</strong><small>{p.mode==="animals"?"International Days Animals":"Etsy mega balíček"} · {sourceCount(p)} zdrojů</small></button>{p.id===project.id?<span className="currentBadge">Otevřený</span>:<button className="iconButton dangerText" aria-label={"Odstranit balíček "+p.name} title="Odstranit balíček" disabled={!!busy} onClick={async()=>{if(window.confirm("Odstranit balíček „"+p.name+"“ a jeho místní podklady? Nejdřív si případně stáhni zálohu.")){await deleteProject(p.id);setProjects(list=>list.filter(x=>x.id!==p.id));notify("Balíček byl odstraněný.");}}}><Trash2 size={16}/></button>}</div>)}</div></div><div className="modalFooter"><button className="button" disabled={!!busy} onClick={()=>restoreRef.current?.click()}><Upload size={15}/>Obnovit zálohu</button><button className="button primary" disabled={!!busy} onClick={()=>{setNewName("");setModal("new");}}><Plus size={15}/>Nový balíček</button></div></Modal>}
    {modal==="download"&&readyFile&&<Modal title={readyFile.pages?"Dobrodružství je připravené":"Záloha je připravená"} description={readyFile.pages?"PDF je sestavené. Teď si ho ulož do počítače.":"Záloha obsahuje tabulku, nastavení i všechny vložené soubory."} onClose={closeModal}><div className="modalBody downloadReady"><div className="downloadReadyIcon"><CheckCircle2 size={34}/></div><h3>{readyFile.name}</h3><p>{readyFile.pages?readyFile.pages+" "+pageLabel(readyFile.pages)+" · ":""}{(readyFile.size/1024/1024).toFixed(2)} MB</p><a className="button primary" href={readyFile.url} download={readyFile.name}><Download size={17}/>{readyFile.pages?"Stáhnout PDF":"Stáhnout zálohu"}</a></div><div className="modalFooter"><span className="formHint">Tvoje rozpracovaná tabulka zůstává uložená.</span><button className="button" onClick={closeModal}>Zpět k balíčku<ArrowRight size={15}/></button></div></Modal>}
    {assetPreview&&<Modal title={assetPreview.name} description={assetPreview.mime==="application/pdf"?"PDF · "+assetPreview.pages+" "+pageLabel(assetPreview.pages):"Náhled vloženého obrázku"} onClose={()=>setAssetPreview(null)} wide><div className="assetPreviewBody"><AssetPreview asset={assetPreview}/></div><div className="modalFooter"><span className="formHint">{(assetPreview.blob.size/1024/1024).toFixed(2)} MB · {assetPreview.origin==="drive"?"Google Drive":assetPreview.origin==="demo"?"Ukázkový podklad":"Místní soubor"}</span><button className="button" onClick={()=>downloadBlob(assetPreview.blob,assetPreview.name)}><Download size={15}/>Stáhnout zdroj</button></div></Modal>}
    {busy&&<div className="operationStatus" role="status"><Loader2 size={17} className="spin"/><div><strong>{busy}</strong>{progress>0&&<div className="operationTrack"><span style={{width:progress+"%"}}/></div>}</div>{progress>0&&<span>{progress} %</span>}</div>}
    {toast&&<div className={"toast "+(toast.error?"errorToast":"")} role={toast.error?"alert":"status"}>{toast.error?<CircleHelp size={18}/>:<CheckCircle2 size={18}/>}<span>{toast.message}</span><button aria-label="Zavřít oznámení" onClick={()=>setToast(null)}><X size={15}/></button></div>}
  </div>;
}
