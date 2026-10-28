import { PDFDocument, PDFFont, PDFPage, rgb, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { Asset, ExportKind, PlanEntry, Project, buildPlan, contentsCapacity, isBookend, normalize } from "./studio-model";
import { publicAssetUrl } from "./studio-runtime";

let fontBytes:Promise<[ArrayBuffer,ArrayBuffer]>|undefined;
async function fonts() {
  fontBytes ||= Promise.all(["/fonts/DejaVuSans.ttf","/fonts/DejaVuSans-Bold.ttf"].map(async path=>{
    const response=await fetch(publicAssetUrl(path));if(!response.ok) throw new Error("Nepodařilo se načíst písmo pro export. Zkus export znovu.");return response.arrayBuffer();
  })) as Promise<[ArrayBuffer,ArrayBuffer]>;
  return fontBytes;
}
const hexColor=(hex:string)=>{const v=/^#[0-9a-f]{6}$/i.test(hex)?hex:"#75414b";return rgb(parseInt(v.slice(1,3),16)/255,parseInt(v.slice(3,5),16)/255,parseInt(v.slice(5,7),16)/255);};
const dark=rgb(.16,.17,.17),muted=rgb(.47,.48,.47),line=rgb(.87,.87,.85);
function lines(text:string,font:PDFFont,size:number,width:number):string[] {
  const result:string[]=[];
  for(const paragraph of text.split("\n")) {
    let current="";
    for(const word of paragraph.split(/\s+/)) {
      if(font.widthOfTextAtSize((current+" "+word).trim(),size)>width&&current) {result.push(current);current=word;}
      else current=(current+" "+word).trim();
    }
    result.push(current);
  }
  return result;
}
function fitText(text:string,font:PDFFont,size:number,width:number):string {
  if(font.widthOfTextAtSize(text,size)<=width) return text;
  let value=text;while(value&&font.widthOfTextAtSize(value+"…",size)>width) value=value.slice(0,-1);
  return value+"…";
}
function drawPaw(page:PDFPage,x:number,y:number,size:number,color:ReturnType<typeof rgb>) {
  page.drawEllipse({x,y:y-size*.12,xScale:size*.28,yScale:size*.23,color});
  for(const [dx,dy,r] of [[-.32,.18,.13],[-.12,.36,.14],[.13,.36,.14],[.33,.16,.13]]) page.drawEllipse({x:x+dx*size,y:y+dy*size,xScale:r*size,yScale:r*size*1.18,color});
}
function footer(page:PDFPage,project:Project,font:PDFFont,number:number,color:ReturnType<typeof rgb>,generated=false) {
  if(!generated&&!project.settings.brand) return;
  const {width}=page.getSize();
  const name=project.settings.brand?project.settings.brandName.trim():"";
  if(name) {page.drawLine({start:{x:35,y:36},end:{x:width-35,y:36},thickness:.5,color:line});page.drawText(fitText(name,font,8,width-110),{x:35,y:21,size:8,font,color});}
  page.drawText(String(number),{x:width-43,y:21,size:8,font,color:muted});
}
function cover(page:PDFPage,project:Project,kind:ExportKind,colored:boolean,regular:PDFFont,bold:PDFFont) {
  const {width:w,height:h}=page.getSize(),cs=project.settings.language==="cs";
  const accent=colored?hexColor(project.settings.accent):dark;
  page.drawRectangle({x:28,y:28,width:w-56,height:h-56,borderColor:colored?rgb(.86,.77,.73):line,borderWidth:1});
  page.drawText(cs?"MALÉ LISTY. VELKÉ OBJEVY.":"LITTLE PAGES. BIG DISCOVERIES.",{x:54,y:h-85,size:9,font:bold,color:accent});
  page.drawLine({start:{x:54,y:h-105},end:{x:108,y:h-105},thickness:2,color:accent});
  let title=project.settings.exportTitle||project.name;
  let size=48;while(size>24&&lines(title,bold,size,w-108).length>3)size-=2;
  const titleLines=lines(title,bold,size,w-108);let y=h-190;
  for(const text of titleLines) {page.drawText(text,{x:54,y,size,font:bold,color:dark});y-=size*1.2;}
  const label=cs?(kind==="complete"?"Omalovánky a obtahovačky":kind==="tracing"?"Sešit obtahovaček":"Sešit omalovánek")
    :(kind==="complete"?"Colouring & tracing activity book":kind==="tracing"?"Tracing activity book":"Colouring activity book");
  page.drawText(label,{x:55,y:y-13,size:13,font:regular,color:muted});
  if(colored)page.drawText(cs?"S barevnými předlohami":"With colour references",{x:55,y:y-38,size:10,font:regular,color:muted});
  const base=h*.25;
  if(colored)page.drawEllipse({x:w*.52,y:base+67,xScale:142,yScale:142,color:rgb(.96,.93,.88)});
  for(const [a,b,c] of [[76,240,352],[269,432,531]]) {
    page.drawLine({start:{x:a,y:base-12},end:{x:b,y:base+133},thickness:1,color:accent});
    page.drawLine({start:{x:b,y:base+133},end:{x:c,y:base-12},thickness:1,color:accent});
  }
  drawPaw(page,w/2,base+47,98,accent);
  page.drawText(cs?"Poznávej. Tvoř. Objevuj.":"Learn. Create. Explore.",{x:54,y:78,size:11,font:regular,color:accent});
}
async function contents(document:PDFDocument,page:PDFPage,project:Project,items:PlanEntry[],index:number,total:number,regular:PDFFont,bold:PDFFont,colored:boolean,background?:Asset) {
  const {width:w,height:h}=page.getSize(),cs=project.settings.language==="cs";
  const accent=colored?hexColor(project.settings.accent):dark;
  if(background){
    const bytes=await background.blob.arrayBuffer();
    if(background.mime==="application/pdf"){
      const input=await PDFDocument.load(bytes),source=input.getPage(0),crop=source.getCropBox();
      const image=await document.embedPage(source,{left:crop.x,bottom:crop.y,right:crop.x+crop.width,top:crop.y+crop.height});
      const rotation=((source.getRotation().angle%360)+360)%360,vw=rotation%180?image.height:image.width,vh=rotation%180?image.width:image.height,scale=Math.min(w/vw,h/vh);
      page.drawPage(image,{x:(w-vw*scale)/2+(rotation===180||rotation===270?vw*scale:0),y:(h-vh*scale)/2+(rotation===90||rotation===180?vh*scale:0),width:image.width*scale,height:image.height*scale,rotate:degrees(-rotation)});
    }else{const image=background.mime==="image/jpeg"?await document.embedJpg(bytes):await document.embedPng(bytes),scale=Math.min(w/image.width,h/image.height);page.drawImage(image,{x:(w-image.width*scale)/2,y:(h-image.height*scale)/2,width:image.width*scale,height:image.height*scale});}
  }else{
    page.drawText(cs?"Co je uvnitř":"What's inside",{x:44,y:h-74,size:29,font:bold,color:dark});
    page.drawText(fitText(project.settings.exportTitle||project.name,regular,11,w-90),{x:45,y:h-100,size:11,font:regular,color:muted});
    if(total>1)page.drawText(String(index+1)+" / "+total,{x:w-80,y:h-100,size:10,font:regular,color:muted});
    page.drawLine({start:{x:44,y:h-122},end:{x:w-44,y:h-122},thickness:1,color:accent});
  }
  const capacity=contentsCapacity(project,!!background),entries=items.slice(index*capacity,(index+1)*capacity);
  const top=background?h*(1-(project.settings.contentsTopPct??20)/100):h-142,bottom=background?h*(project.settings.contentsBottomPct??8)/100:55;
  if(project.settings.contentsStyle==="gallery"){
    const gap=12,cellW=(w-88-gap*2)/3,cellH=(top-bottom)/(capacity/3);
    for(let i=0;i<entries.length;i++){
      const item=entries[i],x=44+(i%3)*(cellW+gap),y=top-Math.floor(i/3)*cellH;
      const thumbHeight=cellH-48;
      let drawn=false;
      if(item.source?.thumbnail){
        try{const image=item.source.thumbnail.startsWith("data:image/png")?await document.embedPng(item.source.thumbnail):await document.embedJpg(item.source.thumbnail),scale=Math.min((cellW-8)/image.width,thumbHeight/image.height);page.drawImage(image,{x:x+(cellW-image.width*scale)/2,y:y-thumbHeight+(thumbHeight-image.height*scale)/2,width:image.width*scale,height:image.height*scale});drawn=true;}
        catch{/* A missing thumbnail does not prevent the full-resolution source export. */}
      }
      if(!drawn){const label=item.source?.mime==="application/pdf"?"PDF":cs?"Pracovní list":"Worksheet";page.drawText(label,{x:x+(cellW-bold.widthOfTextAtSize(label,12))/2,y:y-thumbHeight/2,size:12,font:bold,color:muted});}
      page.drawRectangle({x,y:y-thumbHeight,width:cellW,height:thumbHeight,borderColor:line,borderWidth:.4});
      page.drawText(fitText(item.title,bold,9,cellW),{x,y:y-thumbHeight-13,size:9,font:bold,color:dark});
      if(item.subtitle)page.drawText(fitText(item.subtitle,regular,8,cellW),{x,y:y-thumbHeight-25,size:8,font:regular,color:muted});
      const number=(cs?"str. ":"p. ")+item.start+(item.count>1?"–"+(item.start+item.count-1):"");
      page.drawText(number,{x,y:y-thumbHeight-37,size:8,font:regular,color:accent});
    }
    return;
  }
  let y=top-11;
  for(const item of entries) {
    const title=item.title+(item.subtitle?" · "+item.subtitle:"");
    const number=item.start+(item.count>1?" - "+(item.start+item.count-1):"");
    page.drawText(fitText(title,regular,9.5,w-145),{x:45,y,size:9.5,font:regular,color:dark});
    const numberWidth=regular.widthOfTextAtSize(number,9.5);
    page.drawText(number,{x:w-46-numberWidth,y,size:9.5,font:regular,color:accent});
    page.drawLine({start:{x:45,y:y-8},end:{x:w-45,y:y-8},thickness:.35,color:line});y-=21;
  }
}
function closing(page:PDFPage,project:Project,regular:PDFFont,bold:PDFFont,colored:boolean) {
  const {width:w,height:h}=page.getSize(),cs=project.settings.language==="cs";
  const accent=colored?hexColor(project.settings.accent):dark;
  drawPaw(page,w/2,h*.7,65,accent);
  const title=cs?"Děkujeme!":"Thank you!";
  page.drawText(title,{x:(w-bold.widthOfTextAtSize(title,39))/2,y:h*.53,size:39,font:bold,color:dark});
  const message=project.settings.closingText||(cs?"Každý malý objev se počítá.\nTěšíme se na další společné dobrodružství.":"Every little discovery counts.\nSee you on the next adventure.");
  let y=h*.46;
  for(const text of lines(message,regular,13,w-100)) {page.drawText(text,{x:(w-regular.widthOfTextAtSize(text,13))/2,y,size:13,font:regular,color:muted});y-=22;}
  page.drawLine({start:{x:w/2-25,y:h*.26},end:{x:w/2+25,y:h*.26},thickness:1.5,color:accent});
}
export async function generatePdf(project:Project,kind:ExportKind,withColor:boolean,onProgress?:(done:number,total:number)=>void):Promise<{blob:Blob;filename:string;pages:number}> {
  const plan=buildPlan(project,kind,withColor);
  const activity=plan.filter(e=>!isBookend(project.rows.find(r=>r.id===e.rowId)!));
  if(!activity.length) throw new Error("Nejdřív vlož alespoň jeden zdroj pro zvolenou variantu balíčku.");
  const total=plan.reduce((n,e)=>n+e.count,0);
  if(total>1200) throw new Error("Jeden export může mít nejvýše 1 200 stran.");
  const document=await PDFDocument.create();document.registerFontkit(fontkit);
  const [normalBytes,boldBytes]=await fonts();
  const regular=await document.embedFont(normalBytes,{subset:true}),bold=await document.embedFont(boldBytes,{subset:true});
  const dimensions: [number,number]=project.settings.format==="LETTER"?[612,792]:[595.28,841.89];
  const colored=withColor||kind==="complete";let done=0;
  document.setTitle((project.settings.exportTitle||project.name)+" - "+(kind==="complete"?"Complete activity pack":kind==="tracing"?"Tracing":"Colouring"));
  document.setCreator("Paperwork · Etsy PDF Studio");
  if(project.settings.brand&&project.settings.brandName)document.setAuthor(project.settings.brandName);
  for(const entry of plan) {
    if(entry.generated) {
      for(let i=0;i<entry.count;i++) {
        const page=document.addPage(dimensions);
        if(entry.generated==="cover")cover(page,project,kind,colored,regular,bold);
        if(entry.generated==="contents")await contents(document,page,project,activity,i,entry.count,regular,bold,colored,entry.source);
        if(entry.generated==="closing")closing(page,project,regular,bold,colored);
        footer(page,project,regular,entry.start+i,colored?hexColor(project.settings.accent):dark,true);
        done++;onProgress?.(done,total);
      }
    } else if(entry.source) {
      const source=entry.source;const bytes=await source.blob.arrayBuffer();
      if(source.mime==="application/pdf") {
        const input=await PDFDocument.load(bytes);
        for(const sourcePage of input.getPages()) {
          const crop=sourcePage.getCropBox();
          const embedded=await document.embedPage(sourcePage,{left:crop.x,bottom:crop.y,right:crop.x+crop.width,top:crop.y+crop.height});
          const rotation=((sourcePage.getRotation().angle%360)+360)%360;
          const visualWidth=rotation%180?embedded.height:embedded.width,visualHeight=rotation%180?embedded.width:embedded.height;
          const page=document.addPage(dimensions);
          const margin=project.settings.brand?24:0,foot=project.settings.brand?45:0;
          const scale=Math.min((dimensions[0]-2*margin)/visualWidth,(dimensions[1]-margin-foot)/visualHeight);
          const left=(dimensions[0]-visualWidth*scale)/2,bottom=foot+(dimensions[1]-margin-foot-visualHeight*scale)/2;
          page.drawPage(embedded,{x:left+(rotation===180||rotation===270?visualWidth*scale:0),y:bottom+(rotation===90||rotation===180?visualHeight*scale:0),width:embedded.width*scale,height:embedded.height*scale,rotate:degrees(-rotation)});
          footer(page,project,regular,done+1,colored?hexColor(project.settings.accent):dark);
          done++;onProgress?.(done,total);
          await new Promise(resolve=>setTimeout(resolve,0));
        }
      } else {
        const image=source.mime==="image/jpeg"?await document.embedJpg(bytes):await document.embedPng(bytes);
        const page=document.addPage(dimensions),margin=project.settings.brand?24:0,foot=project.settings.brand?45:0;
        const scale=Math.min((dimensions[0]-margin*2)/image.width,(dimensions[1]-margin-foot)/image.height);
        page.drawImage(image,{x:(dimensions[0]-image.width*scale)/2,y:foot+(dimensions[1]-margin-foot-image.height*scale)/2,width:image.width*scale,height:image.height*scale});
        footer(page,project,regular,done+1,colored?hexColor(project.settings.accent):dark);
        done++;onProgress?.(done,total);
      }
    }
    await new Promise(resolve=>setTimeout(resolve,0));
  }
  const bytes=await document.save();
  const filename=normalize(project.name).replace(/\s+/g,"-")+"-"+kind+(colored?"-with-colour":"-bw")+"-"+project.settings.format.toLowerCase()+".pdf";
  return {blob:new Blob([bytes as BlobPart],{type:"application/pdf"}),filename,pages:document.getPageCount()};
}
