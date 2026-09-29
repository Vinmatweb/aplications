const catalog=[
 {name:"City",subs:["Trains","Police","Fire","Construction","Vehicles","Space","Airport","Harbor","Food","Jungle / Exploration"]},
 {name:"Technic",subs:["Cars","Motorcycles","Construction","Racing","Space","Aircraft"]},
 {name:"Icons",subs:["Vehicles","Landmarks","Botanical Collection","Modular Buildings","Entertainment","Seasonal"]},
 {name:"Ideas",subs:["Space","Nature","Movies & TV","Games","Music","Objects & Display"]},
 {name:"Creator 3in1",subs:["Animals","Vehicles","Buildings","Space"]},
 {name:"Speed Champions",subs:["Supercars","Racing","Formula 1"]},
 {name:"Friends",subs:["Adventure","Animals","City Life","Food","Travel"]},
 {name:"NINJAGO",subs:["Dragons","Mechs","Vehicles","Temples"]},
 {name:"Star Wars",subs:["Starships","Droids","Dioramas","Helmets","Battle"]},
 {name:"Minecraft",subs:["Biomes","Mobs","Buildings","Adventure"]},
 {name:"Disney",subs:["Princess","Movies","Characters","Castles"]},
 {name:"Harry Potter",subs:["Hogwarts","Diagon Alley","Creatures","Vehicles"]},
 {name:"Marvel",subs:["Avengers","Spider-Man","Guardians","Display"]},
 {name:"DC",subs:["Batman","Vehicles","Display"]},
 {name:"DreamZzz",subs:["Dream Creatures","Vehicles","Locations"]},
 {name:"Animal Crossing",subs:["Characters","Homes","Island"]},
 {name:"Sonic",subs:["Characters","Levels","Vehicles"]},
 {name:"Super Mario",subs:["Mario Kart","Characters","Courses","Display"]},
 {name:"Art",subs:["Music","Nature","Characters","Landmarks"]},
 {name:"Architecture",subs:["Skylines","Landmarks"]},
 {name:"Seasonal",subs:["Halloween","Christmas","Easter","Valentine"]}
];
const KEY="ytMusicLibrary.v1"; let data=JSON.parse(localStorage.getItem(KEY)||'{"prompts":{},"audio":{}}');
const slug=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const key=(t,s)=>slug(t)+"__"+slug(s); const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
function stats(t,s){let keys=s?[key(t,s)]:catalog.find(x=>x.name===t).subs.map(x=>key(t,x));let ps=keys.flatMap(k=>data.prompts[k]||[]);return {p:ps.length,g:ps.filter(x=>x.generated).length,a:ps.filter(x=>x.approved).length};}
function statline(x){return `${x.p} prompts · ${x.g} generated · ${x.a} approved`}
function home(){return '<div class="crumb">LEGO</div>'+catalog.map(t=>{let st=stats(t.name);return `<div class="card"><div class="theme-head"><h2><a class="theme-link" href="#theme/${slug(t.name)}">${t.name}</a></h2><span class="stats">${statline(st)}</span></div><div class="subtree">${t.subs.map(s=>`<div class="subrow"><a class="theme-link" href="#theme/${slug(t.name)}/${slug(s)}">${s}</a><span class="stats">${statline(stats(t.name,s))}</span></div>`).join("")}</div></div>`}).join("")}
function themePage(t,focus){return `<div class="crumb"><a href="#">LEGO</a> / ${t.name}</div><h1>${t.name}</h1><div class="navchips">${t.subs.map(s=>`<a class="chip" href="#theme/${slug(t.name)}/${slug(s)}">${s}</a>`).join("")}</div>`+t.subs.map(s=>section(t.name,s)).join("")}
function section(t,s){let k=key(t,s), ps=data.prompts[k]||[], aud=data.audio[k]||[];return `<section class="card section" id="${slug(s)}"><h2>${s}</h2><h3>AI music prompts</h3><div id="p-${k}">${ps.length?ps.map((p,i)=>`<div class="prompt"><div class="prompt-text">${esc(p.text)}</div><button onclick="copyPrompt('${k}',${i})">Copy</button><label class="status"><input type="checkbox" ${p.generated?'checked':''} onchange="toggle('${k}',${i},'generated',this.checked)"> Generated</label><label class="status"><input type="checkbox" ${p.approved?'checked':''} onchange="toggle('${k}',${i},'approved',this.checked)"> Approved</label></div>`).join(""):'<div class="empty">No prompts yet.</div>'}</div><div class="addbar"><textarea id="new-${k}" rows="2" placeholder="Paste a new AI music prompt…"></textarea><button onclick="addPrompt('${k}')">Add prompt</button></div><h3>YouTube Audio Library</h3>${aud.length?`<table class="audio-table"><tr><th>Track</th><th>Artist / note</th><th></th></tr>${aud.map((a,i)=>`<tr><td>${esc(a.title)}</td><td>${esc(a.note||"")}</td><td><button onclick="delAudio('${k}',${i})">×</button></td></tr>`).join("")}</table>`:'<div class="empty">No downloaded tracks recorded yet.</div>'}<div class="addbar"><input id="at-${k}" placeholder="Track name"><input id="an-${k}" placeholder="Artist / note"><button onclick="addAudio('${k}')">Add track</button></div></section>`}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function render(){let parts=location.hash.slice(1).split("/");if(parts[0]==="theme"){let t=catalog.find(x=>slug(x.name)===parts[1]);document.getElementById("app").innerHTML=t?themePage(t,parts[2]):home();if(parts[2])setTimeout(()=>document.getElementById(parts[2])?.scrollIntoView(),0)}else document.getElementById("app").innerHTML=home()}
window.copyPrompt=(k,i)=>navigator.clipboard.writeText(data.prompts[k][i].text);
window.toggle=(k,i,f,v)=>{data.prompts[k][i][f]=v;save();render()};
window.addPrompt=k=>{let e=document.getElementById("new-"+k);if(!e.value.trim())return;(data.prompts[k]??=[]).push({text:e.value.trim(),generated:false,approved:false});save();render()};
window.addAudio=k=>{let t=document.getElementById("at-"+k),n=document.getElementById("an-"+k);if(!t.value.trim())return;(data.audio[k]??=[]).push({title:t.value.trim(),note:n.value.trim()});save();render()};
window.delAudio=(k,i)=>{data.audio[k].splice(i,1);save();render()};
document.getElementById("exportBtn").onclick=()=>{let b=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="youtube-music-library-data.json";a.click()};
addEventListener("hashchange",render);render();