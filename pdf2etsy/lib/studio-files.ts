import { PDFDocument } from "pdf-lib";
import { Asset, uid } from "./studio-model";

let pdfjsPromise:Promise<any>|undefined;
export async function pdfjs() {
  const modulePath="/vendor/pdf.min.mjs";
  pdfjsPromise ||= import(/* @vite-ignore */ modulePath).then(module=>{
    module.GlobalWorkerOptions.workerSrc="/vendor/pdf.worker.min.mjs";return module;
  });
  return pdfjsPromise;
}
export async function imageFromBlob(blob:Blob):Promise<HTMLImageElement> {
  const url=URL.createObjectURL(blob);
  try {
    const image=new Image();
    await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error("Obrázek nejde otevřít. Zkus PNG nebo JPG."));image.src=url;});
    return image;
  } finally {URL.revokeObjectURL(url);}
}
export async function prepareAsset(file:File,origin:Asset["origin"]="local"):Promise<Asset> {
  if(file.size>40*1024*1024) throw new Error(file.name+": maximální velikost souboru je 40 MB.");
  if(!file.size) throw new Error("Soubor "+file.name+" je prázdný.");
  const extension=file.name.split(".").pop()?.toLowerCase();
  const mime=file.type||({pdf:"application/pdf",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp"} as Record<string,string>)[extension||""];
  const asset:Asset={id:uid(),name:file.name,mime,blob:file,thumbnail:"",pages:1,origin};
  if(mime==="application/pdf"||extension==="pdf") {
    asset.mime="application/pdf";
    const bytes=await file.arrayBuffer();
    try {
      const pdf=await PDFDocument.load(bytes);
      asset.pages=pdf.getPageCount();
      if(!asset.pages||asset.pages>500) throw new Error("PDF musí mít 1 až 500 stran.");
    } catch(e) {
      if(e instanceof Error && /500/.test(e.message)) throw e;
      throw new Error(file.name+": PDF je poškozené nebo chráněné heslem. Použij neuzamčené PDF.");
    }
    try {
      const library=await pdfjs();
      const document=await library.getDocument({data:bytes.slice(0),isEvalSupported:false}).promise;
      try {
        const page=await document.getPage(1);
        const original=page.getViewport({scale:1});
        const viewport=page.getViewport({scale:220/Math.max(original.width,original.height)});
        const canvas=documentCanvas();canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
        await page.render({canvasContext:canvas.getContext("2d"),viewport,canvas}).promise;
        asset.thumbnail=canvas.toDataURL("image/jpeg",.82);
      } finally {await document.destroy();}
    } catch { /* A readable PDF remains usable when its thumbnail cannot be rendered. */ }
  } else if(["image/png","image/jpeg","image/webp"].includes(mime)) {
    const image=await imageFromBlob(file);
    if(image.naturalWidth*image.naturalHeight>80_000_000) throw new Error(file.name+": obrázek je příliš velký. Použij rozlišení do 80 megapixelů.");
    asset.width=image.naturalWidth;asset.height=image.naturalHeight;
    const canvas=documentCanvas();const scale=Math.min(1,220/Math.max(asset.width,asset.height));
    canvas.width=Math.ceil(asset.width*scale);canvas.height=Math.ceil(asset.height*scale);
    const context=canvas.getContext("2d")!;context.fillStyle="#fff";context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);
    asset.thumbnail=canvas.toDataURL("image/jpeg",.85);
    if(mime==="image/webp") {
      const full=documentCanvas();full.width=asset.width;full.height=asset.height;full.getContext("2d")!.drawImage(image,0,0);
      asset.blob=await new Promise<Blob>((resolve,reject)=>full.toBlob(b=>b?resolve(b):reject(new Error("Nepodařilo se převést WebP.")),"image/png"));
      asset.mime="image/png";
    }
  } else throw new Error(file.name+": podporované formáty jsou PDF, PNG, JPG a WebP.");
  return asset;
}
function documentCanvas(){return document.createElement("canvas");}

export async function demoAsset(variant:"bw"|"trace"|"color",level:number):Promise<Asset> {
  const canvas=documentCanvas();canvas.width=840;canvas.height=1188;
  const c=canvas.getContext("2d")!;c.fillStyle="#fff";c.fillRect(0,0,840,1188);
  const color=variant==="color";c.strokeStyle="#353738";c.lineWidth=variant==="trace"?3:5;
  if(variant==="trace") c.setLineDash([4,10]);
  c.fillStyle=color?"#dce7de":"#fff";c.beginPath();c.moveTo(80,780);c.lineTo(275,440);c.lineTo(430,780);c.closePath();c.fill();c.stroke();
  c.fillStyle=color?"#e9e3d3":"#fff";c.beginPath();c.moveTo(370,780);c.lineTo(610,350);c.lineTo(770,780);c.closePath();c.fill();c.stroke();
  c.fillStyle=color?"#ecd4a9":"#fff";
  c.beginPath();c.ellipse(425,675,180,130,0,0,Math.PI*2);c.fill();c.stroke();
  c.beginPath();c.ellipse(280,560,95,90,0,0,Math.PI*2);c.fill();c.stroke();
  for(const x of [225,325]){c.beginPath();c.arc(x,492,29,0,Math.PI*2);c.fill();c.stroke();}
  c.beginPath();c.moveTo(570,680);c.bezierCurveTo(760,600,740,890,590,855);c.stroke();
  for(const x of [315,490]){c.beginPath();c.roundRect(x,720,60,110,20);c.fill();c.stroke();}
  c.fillStyle="#353738";for(const x of [253,303]){c.beginPath();c.arc(x,550,6,0,7);c.fill();}
  c.beginPath();c.moveTo(270,585);c.lineTo(288,585);c.lineTo(279,596);c.closePath();c.fill();c.stroke();
  for(let i=0;i<Math.min(level*4,20);i++){const x=330+(i%5)*47,y=610+Math.floor(i/5)*38;c.beginPath();c.ellipse(x,y,9,6,Math.PI/5,0,Math.PI*2);c.stroke();}
  c.setLineDash([]);c.font="14px sans-serif";c.fillStyle="#8a8a8a";c.textAlign="center";c.fillText("PAPERWORK DEMO · SAMPLE ARTWORK · LEVEL "+level,420,1080);
  const blob=await new Promise<Blob>(resolve=>canvas.toBlob(b=>resolve(b!),"image/png"));
  return prepareAsset(new File([blob],"demo_level_"+level+"_"+variant+".png",{type:"image/png"}),"demo");
}
