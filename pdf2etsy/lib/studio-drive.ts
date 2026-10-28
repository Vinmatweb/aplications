import { isSourceSubfolder, naturalOrder, supportedSource, type SourceFolder } from "./studio-sources";

const SCOPE="https://www.googleapis.com/auth/drive.readonly";
const FOLDER="application/vnd.google-apps.folder";
const MAX_BYTES=40*1024*1024;
type TokenResponse={access_token?:string;expires_in?:number;error?:string;scope?:string};
type Identity={accounts:{oauth2:{initTokenClient:(config:{client_id:string;scope:string;include_granted_scopes:boolean;callback:(r:TokenResponse)=>void;error_callback:(e:{type?:string})=>void})=>{requestAccessToken:(config?:{prompt:string})=>void};hasGrantedAllScopes:(response:TokenResponse,...scopes:string[])=>boolean}}};
export type DriveSource={id:string;name:string;mimeType:string;size?:string;path:string};
export type DriveConfig={clientId:string;root:string};
let identityPromise:Promise<void>|undefined,session:{token:string;expires:number}|undefined;
const identity=()=>(window as Window&{google?:Identity}).google;
export function loadDriveIdentity():Promise<void> {
  if(identity())return Promise.resolve();
  identityPromise ||= new Promise<void>((resolve,reject)=>{
    const script=document.createElement("script");script.src="https://accounts.google.com/gsi/client";script.async=true;
    const fail=()=>{clearTimeout(timeout);script.remove();identityPromise=undefined;reject(new Error("Přihlašování Google se nepodařilo načíst. Zkus to znovu nebo použij místní složku."));};
    const timeout=setTimeout(fail,15000);
    script.onload=()=>{clearTimeout(timeout);if(identity())resolve();else fail();};script.onerror=fail;document.head.appendChild(script);
  });
  return identityPromise;
}
export function driveFolderId(value:string):string {
  const text=value.trim();let id=text;
  if(/^https?:/i.test(text)){
    let url:URL;try{url=new URL(text);}catch{throw new Error("Vlož platný odkaz na složku Google Drive.");}
    if(url.protocol!=="https:"||url.hostname!=="drive.google.com")throw new Error("Odkaz na složku musí vést na https://drive.google.com.");
    id=url.pathname.match(/\/folders\/([\w-]+)/)?.[1]||url.searchParams.get("id")||"";
  }
  if(!/^[\w-]{10,200}$/.test(id))throw new Error("Vlož odkaz nebo ID hlavní složky na Google Drive.");
  return id;
}
export function readDriveConfig():DriveConfig {
  try{const value=JSON.parse(localStorage.getItem("paperwork-drive-config")||"{}");return {clientId:typeof value.clientId==="string"?value.clientId:"",root:typeof value.root==="string"?value.root:""};}catch{return {clientId:"",root:""};}
}
export function saveDriveConfig(config:DriveConfig){try{localStorage.setItem("paperwork-drive-config",JSON.stringify(config));}catch{/* Configuration can still be used for this session. */}}
export function disconnectDrive(){session=undefined;}
// Called synchronously by the connect button, after the identity script is ready.
export function connectDrive(clientId:string):Promise<void> {
  if(!/^[\w.-]+\.apps\.googleusercontent\.com$/.test(clientId.trim()))return Promise.reject(new Error("Vyplň platné OAuth Client ID webové aplikace."));
  const google=identity();if(!google)return Promise.reject(new Error("Přihlášení Google se ještě načítá. Zkus připojení znovu."));
  return new Promise((resolve,reject)=>{
    const client=google.accounts.oauth2.initTokenClient({client_id:clientId.trim(),scope:SCOPE,include_granted_scopes:false,
      callback:r=>{if(r.error||!r.access_token||!google.accounts.oauth2.hasGrantedAllScopes(r,SCOPE)){reject(new Error("Google Drive nebyl připojen. Pro čtení složek a podkladů povol přístup pouze ke čtení."));return;}session={token:r.access_token,expires:Date.now()+Math.max(0,(Number(r.expires_in)||3600)-60)*1000};resolve();},
      error_callback:()=>reject(new Error("Přihlášení bylo zavřené nebo prohlížeč zablokoval vyskakovací okno. Klikni znovu na Připojit."))});
    client.requestAccessToken({prompt:"select_account"});
  });
}
async function request(path:string,params:Record<string,string>={}):Promise<Response> {
  if(!session||session.expires<Date.now()){session=undefined;throw new Error("Připojení Google Drive vypršelo. Klikni znovu na Připojit.");}
  const url=new URL("https://www.googleapis.com/drive/v3/"+path);
  for(const [key,value] of Object.entries({supportsAllDrives:"true",...params}))url.searchParams.set(key,value);
  const response=await fetch(url,{headers:{Authorization:"Bearer "+session.token},credentials:"omit",signal:AbortSignal.timeout(30000)});
  if(response.status===401){session=undefined;throw new Error("Připojení Google Drive vypršelo. Klikni znovu na Připojit.");}
  if(!response.ok)throw new Error(response.status===403?"Google nepovolil čtení. Ověř zapnuté Drive API a oprávnění ke složce.":response.status===404?"Soubor nebo složka na Disku nejsou dostupné pro přihlášený účet.":"Google Drive nyní neodpovídá ("+response.status+"). Zkus to později.");
  return response;
}
type DriveItem={id:string;name:string;mimeType:string;size?:string};
async function children(folder:string):Promise<DriveItem[]> {
  const out:DriveItem[]=[],pages=new Set<string>();let page="";
  do{
    const response=await request("files",{q:"'"+driveFolderId(folder)+"' in parents and trashed = false",pageSize:"1000",orderBy:"name_natural",includeItemsFromAllDrives:"true",fields:"nextPageToken,files(id,name,mimeType,size)",...(page?{pageToken:page}:{})});
    const data=await response.json() as {files?:DriveItem[];nextPageToken?:string};out.push(...(data.files||[]));page=data.nextPageToken||"";
    if(out.length>10000||page&&pages.has(page))throw new Error("Složka má příliš mnoho položek nebo Google opakuje stránku výsledků. Vyber menší hlavní složku.");
    if(page)pages.add(page);
  }while(page);
  return out;
}
export async function driveCatalog(root:string):Promise<SourceFolder[]> {
  const id=driveFolderId(root),meta=await (await request("files/"+encodeURIComponent(id),{fields:"id,name,mimeType"})).json() as DriveItem;
  if(meta.mimeType!==FOLDER)throw new Error("Vybraný odkaz musí vést na složku, nikoli na jednotlivý soubor.");
  const items=await children(id),folders=items.filter(f=>f.mimeType===FOLDER);
  if(folders.length&&folders.every(f=>isSourceSubfolder(f.name)))return [{id:"drive:"+id,name:meta.name,kind:"drive",driveId:id}];
  const result:SourceFolder[]=folders.map(f=>({id:"drive:"+f.id,name:f.name,kind:"drive",driveId:f.id}));
  if(!folders.length||items.some(f=>supportedSource(f.name)))result.unshift({id:"drive:"+id,name:meta.name,kind:"drive",driveId:id});
  return result.sort((a,b)=>naturalOrder(a.name,b.name));
}
export async function listDriveSources(folder:string):Promise<DriveSource[]> {
  const out:DriveSource[]=[],seen=new Set<string>();
  async function walk(id:string,path:string,depth:number){
    if(seen.has(id))return;seen.add(id);
    if(depth>8||seen.size>1000)throw new Error("Složka má příliš mnoho podsložek. Vyber menší složku s podklady.");
    for(const f of await children(id)){
      if(f.mimeType===FOLDER)await walk(f.id,path+f.name+"/",depth+1);
      else if(supportedSource(f.name)&&["application/pdf","image/png","image/jpeg","image/webp"].includes(f.mimeType)){out.push({...f,path:path+f.name});if(out.length>400)throw new Error("Ve složce je více než 400 podkladů. Vyber menší složku.");}
    }
  }
  await walk(driveFolderId(folder),"",0);
  return out.sort((a,b)=>naturalOrder(a.path,b.path));
}
export async function downloadDriveSource(file:DriveSource):Promise<File> {
  if(Number(file.size)>MAX_BYTES)throw new Error(file.name+": maximální velikost souboru je 40 MB.");
  const response=await request("files/"+encodeURIComponent(driveFolderId(file.id)),{alt:"media"});
  if(Number(response.headers.get("content-length"))>MAX_BYTES){await response.body?.cancel();throw new Error(file.name+": soubor je větší než 40 MB.");}
  const reader=response.body?.getReader();if(!reader)throw new Error("Google neposlal obsah souboru.");
  const chunks:Uint8Array[]=[];let size=0;
  try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BYTES){await reader.cancel();throw new Error(file.name+": soubor je větší než 40 MB.");}chunks.push(value);}}finally{reader.releaseLock();}
  return new File(chunks as BlobPart[],file.name,{type:file.mimeType});
}
