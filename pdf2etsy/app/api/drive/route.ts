export const dynamic="force-dynamic";
const json=(message:string,status=400)=>Response.json({error:message},{status,headers:{"Cache-Control":"private, no-store"}});
const allowed=(url:URL)=>url.protocol==="https:"&&(url.hostname==="drive.google.com"||url.hostname==="drive.usercontent.google.com"||url.hostname.endsWith(".googleusercontent.com"));

export async function POST(request:Request) {
  const origin=request.headers.get("origin");
  if(!origin||origin!==new URL(request.url).origin)return json("Požadavek musí pocházet z této aplikace.",403);
  let value:{url?:unknown};
  try{const raw=await request.json();if(!raw||typeof raw!=="object")return json("Neplatný odkaz.");value=raw as {url?:unknown};}catch{return json("Neplatný odkaz.");}
  if(typeof value.url!=="string"||value.url.length>2048)return json("Vlož odkaz na soubor z Google Drive.");
  let source:URL;
  try{source=new URL(value.url);}catch{return json("Vlož úplný odkaz na Google Drive.");}
  if(source.protocol!=="https:"||source.hostname!=="drive.google.com")return json("Podporován je odkaz https://drive.google.com/file/d/…");
  const id=source.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1]||source.searchParams.get("id");
  if(!id||!/^[a-zA-Z0-9_-]{10,200}$/.test(id))return json("V odkazu chybí platné ID souboru. Odkazy na složky zde nelze importovat.");
  try {
    let target=new URL("https://drive.google.com/uc?export=download&id="+encodeURIComponent(id));
    let response:Response|undefined;
    const signal=AbortSignal.timeout(25000);
    for(let i=0;i<5;i++){
      if(!allowed(target))return json("Disk přesměroval na nepodporovanou adresu.",422);
      response=await fetch(target.toString(),{redirect:"manual",signal,headers:{Accept:"application/pdf,image/png,image/jpeg,image/webp"}});
      if(response.status>=300&&response.status<400){
        const location=response.headers.get("location");if(!location)return json("Soubor nelze stáhnout.",422);
        target=new URL(location,target);
      }else break;
    }
    if(!response?.ok||!response.body)return json("Soubor není veřejně dostupný. Soukromý soubor stáhni z Disku a přetáhni do aplikace.",422);
    const mime=(response.headers.get("content-type")||"").split(";")[0];
    if(!["application/pdf","image/png","image/jpeg","image/webp"].includes(mime))return json("Disk neposkytl přímo PDF nebo obrázek. Použij soubor dostupný komukoli s odkazem, nebo jej stáhni ručně.",422);
    const max=25*1024*1024;
    if(Number(response.headers.get("content-length"))>max)return json("Import přes odkaz podporuje soubory do 25 MB. Větší soubor nahraj z počítače.",413);
    const reader=response.body.getReader();const chunks:Uint8Array[]=[];let size=0;
    while(true){const next=await reader.read();if(next.done)break;size+=next.value.length;if(size>max){await reader.cancel();return json("Soubor přesahuje limit 25 MB.",413);}chunks.push(next.value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    const ext={"application/pdf":"pdf","image/png":"png","image/jpeg":"jpg","image/webp":"webp"}[mime];
    return new Response(bytes,{headers:{"Content-Type":mime,"Content-Disposition":"attachment; filename=\"drive-"+id+"."+ext+"\"","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
  }catch{return json("Google Drive teď soubor neposkytl. Zkus to znovu nebo soubor nahraj přímo z počítače.",502);}
}
