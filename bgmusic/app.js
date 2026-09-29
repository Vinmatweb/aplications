const catalog=[
{name:"City",subs:["Trains","Police","Fire","Construction","Vehicles","Space","Airport","Harbor","Food","Jungle / Exploration"]},
{name:"Technic",subs:["Cars","Motorcycles","Construction","Racing","Space","Aircraft"]},
{name:"Icons",subs:["Vehicles","Landmarks","Botanical Collection","Modular Buildings","Entertainment","Seasonal"]},
{name:"Ideas",subs:["Space","Nature","Movies & TV","Games","Music","Objects & Display"]},
{name:"Creator 3in1",subs:["Animals","Vehicles","Buildings","Space"]},{name:"Speed Champions",subs:["Supercars","Racing","Formula 1"]},
{name:"Friends",subs:["Adventure","Animals","City Life","Food","Travel"]},{name:"NINJAGO",subs:["Dragons","Mechs","Vehicles","Temples"]},
{name:"Star Wars",subs:["Starships","Droids","Dioramas","Helmets","Battle"]},{name:"Minecraft",subs:["Biomes","Mobs","Buildings","Adventure"]},
{name:"Disney",subs:["Princess","Movies","Characters","Castles"]},{name:"Harry Potter",subs:["Hogwarts","Diagon Alley","Creatures","Vehicles"]},
{name:"Marvel",subs:["Avengers","Spider-Man","Guardians","Display"]},{name:"DC",subs:["Batman","Vehicles","Display"]},
{name:"DreamZzz",subs:["Dream Creatures","Vehicles","Locations"]},{name:"Animal Crossing",subs:["Characters","Homes","Island"]},
{name:"Sonic",subs:["Characters","Levels","Vehicles"]},{name:"Super Mario",subs:["Mario Kart","Characters","Courses","Display"]},
{name:"Art",subs:["Music","Nature","Characters","Landmarks"]},{name:"Architecture",subs:["Skylines","Landmarks"]},
{name:"Seasonal",subs:["Halloween","Christmas","Easter","Valentine"]}];
const seededPrompts={
  "seasonal__christmas": [
    {
      "text": "40874 Santa’s Holiday Countdown — Advent Glow\n\nCreate a warm, cheerful instrumental background track for step-by-step building instructions featuring a festive Santa holiday countdown and advent display.\n\nStyle: light Christmas chill with acoustic and electronic elements.\nMood: cozy, expectant, playful, magical and family-friendly.\nUse soft acoustic guitar, warm electric piano, gentle sleigh bells, celesta-like plucks, light percussion and a smooth bass line.\nAround 100 BPM.\n\nKeep the rhythm steady, simple and unobtrusive with consistent energy while instruction pages change every five seconds. Suggest the pleasant anticipation of counting down to Christmas without becoming cinematic or dramatic.\n\nAvoid recognizable Christmas melodies, dramatic transitions, drops, breakdowns, heavy bass and dominant lead themes.\n\nInstrumental only. No vocals, vocal chops or spoken words. Original composition only.",
      "generated": false,
      "approved": false
    },
    {
      "text": "40874 Santa’s Holiday Countdown — December Morning\n\nCreate a calm festive instrumental background track for step-by-step building instructions featuring Santa and an advent countdown.\n\nStyle: acoustic holiday chill with subtle lo-fi and light electronic touches.\nMood: warm, peaceful, bright, cozy and gently playful.\nUse soft fingerpicked acoustic guitar, warm piano, subtle glockenspiel, delicate sleigh-bell percussion, soft bass and understated electronic drums.\nAround 92 BPM.\n\nMaintain a smooth repeating flow and very consistent dynamics so the music stays comfortably in the background as instruction images change every five seconds.\n\nAvoid famous carol melodies, large musical events, dramatic chord changes, long intros, heavy percussion and strong lead instruments.\n\nInstrumental only. No vocals or spoken words. Family-friendly and original.",
      "generated": false,
      "approved": false
    },
    {
      "text": "40866 Santa’s Holiday Sleigh Adventure — Sleigh Ride Journey\n\nCreate a light upbeat instrumental background track for step-by-step building instructions featuring Santa’s sleigh on a cheerful holiday adventure.\n\nStyle: melodic Christmas house with acoustic and orchestral accents.\nMood: joyful, adventurous, festive, bright and friendly.\nUse gentle sleigh bells, warm string pizzicato, soft melodic synth plucks, acoustic guitar, light electronic drums and smooth bass.\nAround 108 BPM.\n\nCreate a steady sense of forward motion like a relaxed sleigh journey while keeping the arrangement simple and unobtrusive for instruction pages changing every five seconds.\n\nAvoid dramatic cinematic scoring, recognizable Christmas melodies, big drops, heavy bass and attention-grabbing solos.\n\nInstrumental only. No vocals, vocal chops or spoken words. Original composition only.",
      "generated": false,
      "approved": false
    },
    {
      "text": "40866 Santa’s Holiday Sleigh Adventure — Snowy Route\n\nCreate a relaxed festive instrumental background track for step-by-step building instructions featuring Santa’s sleigh traveling through a snowy holiday landscape.\n\nStyle: soft acoustic-electronic Christmas chill.\nMood: peaceful, magical, warm, gently adventurous and family-friendly.\nUse soft acoustic guitar, warm piano, subtle celesta, delicate sleigh bells, light percussion, airy pads and gentle bass.\nAround 96 BPM.\n\nKeep a smooth repetitive pulse with small variations and consistent dynamics. The track should feel festive but remain subtle behind instruction images changing every five seconds.\n\nAvoid famous carols, dramatic swells, action-movie tension, drops and prominent lead melodies.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
      "generated": false,
      "approved": false
    },
    {
      "text": "40875 Up-Scaled Mrs. Claus Minifigure — Mrs. Claus Workshop\n\nCreate a warm playful instrumental background track for step-by-step building instructions featuring a large festive Mrs. Claus character display.\n\nStyle: cozy Christmas acoustic-electronic with light whimsical elements.\nMood: welcoming, cheerful, crafty, warm and gently playful.\nUse warm piano, soft acoustic guitar, pizzicato strings, subtle glockenspiel, light sleigh bells, soft electronic drums and smooth bass.\nAround 98 BPM.\n\nKeep the arrangement friendly, repetitive and consistent so it supports instruction pages changing every five seconds without demanding attention.\n\nAvoid cartoon comedy effects, recognizable Christmas melodies, dramatic transitions, drops and heavy orchestration.\n\nInstrumental only. No vocals or spoken words. Family-friendly and original.",
      "generated": false,
      "approved": false
    },
    {
      "text": "40875 Up-Scaled Mrs. Claus Minifigure — Cozy Holiday Character\n\nCreate a calm festive instrumental background track for step-by-step building instructions featuring a cheerful Mrs. Claus holiday character display.\n\nStyle: soft holiday lounge with acoustic and light electronic elements.\nMood: cozy, elegant, friendly, warm and relaxed.\nUse gentle electric piano, soft acoustic guitar, muted bells, subtle brushed-style percussion, warm bass and delicate synth pads.\nAround 90 BPM.\n\nMaintain steady low-key energy and a simple repeating musical theme while instruction images change every five seconds.\n\nAvoid famous seasonal tunes, dramatic buildups, strong rhythmic breaks and dominant melodies.\n\nInstrumental only. No vocals, vocal chops or spoken words. Original composition only.",
      "generated": false,
      "approved": false
    },
    {
      "text": "40958 Christmas Stocking — Stocking by the Fireplace\n\nCreate a cozy instrumental background track for step-by-step building instructions featuring a decorative Christmas stocking.\n\nStyle: acoustic Christmas chill with warm ambient elements.\nMood: cozy, intimate, festive, peaceful and nostalgic without sounding sad.\nUse soft acoustic guitar, warm piano, subtle celesta, light sleigh bells, gentle percussion and smooth bass.\nAround 92 BPM.\n\nKeep the music steady, simple and unobtrusive with consistent dynamics while instruction pages change every five seconds. Evoke a warm fireplace and quiet holiday evening.\n\nAvoid recognizable Christmas melodies, dramatic swells, orchestral climaxes and strong lead themes.\n\nInstrumental only. No vocals or spoken words. Family-friendly and original.",
      "generated": false,
      "approved": false
    },
    {
      "text": "40958 Christmas Stocking — Holiday Hearth\n\nCreate a light warm instrumental background track for step-by-step building instructions featuring a festive Christmas stocking decoration.\n\nStyle: gentle melodic holiday chill with acoustic-electronic production.\nMood: bright, comforting, cheerful and relaxed.\nUse soft melodic plucks, warm electric piano, fingerpicked guitar, delicate bells, subtle electronic drums and warm bass.\nAround 98 BPM.\n\nMaintain an even repeating groove and consistent volume so the track remains in the background as instruction images change every five seconds.\n\nAvoid known carol melodies, drops, dramatic transitions, heavy bass and busy arrangements.\n\nInstrumental only. No vocals, vocal chops or spoken words. Original composition only.",
      "generated": false,
      "approved": false
    },
    {
      "text": "40862 Holiday Ornament Selection 2 — Ornament Workshop\n\nCreate a delicate cheerful instrumental background track for step-by-step building instructions featuring colorful Christmas tree ornaments and holiday decorations.\n\nStyle: light festive acoustic-electronic with gentle whimsical details.\nMood: bright, creative, sparkling, friendly and calm.\nUse soft pizzicato strings, gentle glockenspiel, acoustic guitar, warm piano, subtle sleigh bells, light percussion and smooth bass.\nAround 102 BPM.\n\nUse small sparkling accents while keeping the rhythm steady and the dynamics consistent for instruction pages changing every five seconds.\n\nAvoid recognizable Christmas melodies, overly childish sound effects, dramatic transitions and dominant lead instruments.\n\nInstrumental only. No vocals or spoken words. Family-friendly and original.",
      "generated": false,
      "approved": false
    },
    {
      "text": "40862 Holiday Ornament Selection 2 — Winter Decorations\n\nCreate a calm elegant instrumental background track for step-by-step building instructions featuring festive ornaments and Christmas decorations.\n\nStyle: ambient Christmas chill with acoustic touches.\nMood: peaceful, clean, magical, warm and gently festive.\nUse airy pads, warm piano, soft acoustic guitar, delicate bell tones, very light percussion and gentle bass.\nAround 88 BPM.\n\nKeep the arrangement minimal, repetitive and smooth with consistent dynamics. The music should remain subtle while instructional images change every five seconds.\n\nAvoid famous holiday tunes, dramatic cinematic swells, heavy percussion and strong melodies.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
      "generated": false,
      "approved": false
    },
    {
      "text": "40865 Buddy the Elf — Playful Holiday Movie\n\nCreate a cheerful playful instrumental background track for step-by-step building instructions featuring a colorful Christmas comedy character display.\n\nStyle: light festive pop-electronic with acoustic and whimsical orchestral accents.\nMood: upbeat, playful, optimistic, quirky and family-friendly.\nUse pizzicato strings, soft brass-like accents, warm piano, acoustic guitar, subtle bells, light electronic drums and smooth bass.\nAround 106 BPM.\n\nKeep the groove steady and the musical humor subtle so the track stays useful as background music while instruction pages change every five seconds.\n\nDo not imitate any existing movie score, song or soundtrack. Avoid recognizable Christmas melodies, slapstick sound effects, dramatic transitions, drops and heavy bass.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
      "generated": false,
      "approved": false
    },
    {
      "text": "40865 Buddy the Elf — North Pole Cheer\n\nCreate a light relaxed instrumental background track for step-by-step building instructions featuring a playful Christmas movie character.\n\nStyle: cozy festive acoustic-electronic with gentle whimsical elements.\nMood: cheerful, innocent, warm, playful and easygoing.\nUse acoustic guitar, warm electric piano, soft pizzicato strings, delicate glockenspiel, subtle sleigh bells and light percussion.\nAround 96 BPM.\n\nMaintain a simple repeating structure, consistent energy and unobtrusive melody for instructional images changing every five seconds.\n\nDo not imitate any existing film music or songs. Avoid famous Christmas melodies, big buildups, dramatic orchestration and strong lead themes.\n\nInstrumental only. No vocals or spoken words. Family-friendly and original.",
      "generated": false,
      "approved": false
    },
    {
      "text": "11387 Holiday House — Christmas House Evening\n\nCreate a warm atmospheric instrumental background track for step-by-step building instructions featuring a detailed festive holiday house.\n\nStyle: cinematic Christmas chill with acoustic and light electronic elements.\nMood: cozy, elegant, magical, peaceful and welcoming.\nUse warm piano, soft acoustic guitar, gentle strings, delicate celesta, subtle sleigh bells, airy pads and understated percussion.\nAround 94 BPM.\n\nCreate the feeling of a warmly lit Christmas house on a quiet winter evening while keeping the arrangement steady and unobtrusive for instruction pages changing every five seconds.\n\nAvoid recognizable Christmas melodies, dramatic movie-score climaxes, large transitions and dominant lead instruments.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
      "generated": false,
      "approved": false
    },
    {
      "text": "11387 Holiday House — Snowy Home\n\nCreate a gentle festive instrumental background track for step-by-step building instructions featuring a cozy Christmas holiday house in a snowy setting.\n\nStyle: acoustic ambient holiday chill.\nMood: warm, calm, nostalgic, peaceful and softly magical.\nUse fingerpicked acoustic guitar, warm piano, subtle string pads, soft bell tones, light brushed percussion and gentle bass.\nAround 88 BPM.\n\nMaintain very consistent dynamics and a smooth repeating flow so the music stays comfortably behind instruction images changing every five seconds.\n\nAvoid famous carols, dramatic crescendos, heavy percussion, drops and prominent melodic hooks.\n\nInstrumental only. No vocals, vocal chops or spoken words. Family-friendly and original.",
      "generated": false,
      "approved": false
    }
  ]
};
const SEED_KEY="ytMusicLibrary.seed.seasonalChristmas.v1";
const KEY="ytMusicLibrary.v2",OLD="ytMusicLibrary.v1";
let data=load();
function load(){try{let x=localStorage.getItem(KEY)||localStorage.getItem(OLD);let d=x?JSON.parse(x):{},prompts=d.prompts||{};if(localStorage.getItem(SEED_KEY)!=="1"){for(const [k,items] of Object.entries(seededPrompts)){let arr=prompts[k]??=[];let seen=new Set(arr.map(x=>x.text));for(const item of items)if(!seen.has(item.text))arr.push({...item});prompts[k]=arr}localStorage.setItem(SEED_KEY,"1");localStorage.setItem(KEY,JSON.stringify({prompts,audio:d.audio||{}}))}return {prompts,audio:d.audio||{}}}catch(e){let prompts={};for(const [k,items] of Object.entries(seededPrompts))prompts[k]=items.map(x=>({...x}));localStorage.setItem(SEED_KEY,"1");return {prompts,audio:{}}}}
const slug=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const key=(t,s)=>slug(t)+"__"+slug(s), esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function toast(s){let e=document.getElementById("toast");e.textContent=s;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1400)}
function keysFor(t,s){return s?[key(t,s)]:catalog.find(x=>x.name===t).subs.map(x=>key(t,x))}
function stats(t,s){let ks=t?keysFor(t,s):Object.keys(data.prompts),ps=ks.flatMap(k=>data.prompts[k]||[]),aud=(t?ks:Object.keys(data.audio)).flatMap(k=>data.audio[k]||[]);return{p:ps.length,g:ps.filter(x=>x.generated).length,a:ps.filter(x=>x.approved).length,y:aud.length}}
function statline(x){return `${x.p} prompts · ${x.g} generated · ${x.a} approved · ${x.y} library`}
function summary(){let s=stats();document.getElementById("summary").innerHTML=`<div class="summary"><div class="metric"><strong>${s.p}</strong><span>AI prompts</span></div><div class="metric"><strong>${s.g}</strong><span>Generated tracks</span></div><div class="metric"><strong>${s.a}</strong><span>Approved tracks</span></div><div class="metric"><strong>${s.y}</strong><span>YouTube Library tracks</span></div></div>`}
function home(q=""){let qq=q.toLowerCase();let themeNav=`<div class="navchips">${catalog.map(t=>`<a class="chip" href="#theme/${slug(t.name)}">${t.name}</a>`).join("")}</div>`;let cards=catalog.filter(t=>!qq||t.name.toLowerCase().includes(qq)||t.subs.some(s=>s.toLowerCase().includes(qq))).map(t=>{let st=stats(t.name);let subs=t.subs.filter(s=>!qq||t.name.toLowerCase().includes(qq)||s.toLowerCase().includes(qq));return `<div class="card"><div class="theme-head"><div><h2><a class="theme-link" href="#theme/${slug(t.name)}">${t.name}</a></h2><div class="progress"><i style="width:${st.p?Math.round(st.a/st.p*100):0}%"></i></div></div><span class="stats">${statline(st)}</span></div><div class="subtree">${subs.map(s=>`<div class="subrow"><a class="theme-link" href="#theme/${slug(t.name)}/${slug(s)}">${s}</a><span class="stats">${statline(stats(t.name,s))}</span></div>`).join("")}</div></div>`}).join("");return `<div class="crumb">LEGO</div>${themeNav}<div class="searchrow"><input class="search" id="search" value="${esc(q)}" placeholder="Search theme or subtheme…"></div>`+(cards||'<div class="empty">Nothing found.</div>')}
function themePage(t){return `<div class="crumb"><a href="#">LEGO</a> / ${t.name}</div><div class="section-head"><h1>${t.name}</h1><span class="stats">${statline(stats(t.name))}</span></div><div class="navchips">${t.subs.map(s=>`<a class="chip" href="#theme/${slug(t.name)}/${slug(s)}">${s}</a>`).join("")}</div>`+t.subs.map(s=>section(t.name,s)).join("")}
function section(t,s){let k=key(t,s),ps=data.prompts[k]||[],aud=data.audio[k]||[],st=stats(t,s);return `<section class="card section" id="${slug(s)}"><div class="section-head"><h2>${s}</h2><span class="pill">${statline(st)}</span></div><h3>AI music prompts</h3>${ps.length?ps.map((p,i)=>`<div class="prompt"><div class="num">${i+1}.</div><div class="prompt-text">${esc(p.text)}</div><button onclick="copyPrompt('${k}',${i})">Copy</button><label class="status"><input type="checkbox" ${p.generated?"checked":""} onchange="toggle('${k}',${i},'generated',this.checked)">Generated</label><label class="status"><input type="checkbox" ${p.approved?"checked":""} onchange="toggle('${k}',${i},'approved',this.checked)">Approved</label><button class="danger delete" onclick="delPrompt('${k}',${i})">×</button></div>`).join(""):'<div class="empty">No prompts yet.</div>'}<div class="addbar"><textarea id="new-${k}" rows="2" placeholder="Paste one prompt, or several prompts separated by blank lines…"></textarea><button class="primary" onclick="addPrompt('${k}')">Add prompt(s)</button></div><h3>YouTube Audio Library</h3>${aud.length?`<table class="audio-table"><tr><th>Track</th><th>Artist / note</th><th></th></tr>${aud.map((a,i)=>`<tr><td>${esc(a.title)}</td><td>${esc(a.note)}</td><td><button class="danger" onclick="delAudio('${k}',${i})">×</button></td></tr>`).join("")}</table>`:'<div class="empty">No downloaded tracks recorded yet.</div>'}<div class="addbar"><input id="at-${k}" placeholder="Track name"><input id="an-${k}" placeholder="Artist / note"><button onclick="addAudio('${k}')">Add track</button></div></section>`}
function render(){summary();let parts=location.hash.slice(1).split("/");if(parts[0]==="theme"){let t=catalog.find(x=>slug(x.name)===parts[1]);app.innerHTML=t?themePage(t):home();if(parts[2])setTimeout(()=>document.getElementById(parts[2])?.scrollIntoView(),0)}else app.innerHTML=home();let se=document.getElementById("search");if(se)se.oninput=e=>app.innerHTML=home(e.target.value)}
window.copyPrompt=(k,i)=>navigator.clipboard.writeText(data.prompts[k][i].text).then(()=>toast("Prompt copied"));
window.toggle=(k,i,f,v)=>{data.prompts[k][i][f]=v;if(f==="approved"&&v)data.prompts[k][i].generated=true;save();render()};
window.addPrompt=k=>{let e=document.getElementById("new-"+k),items=e.value.trim().split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);if(!items.length)return;(data.prompts[k]??=[]).push(...items.map(text=>({text,generated:false,approved:false})));save();render();toast(items.length+" prompt(s) added")};
window.delPrompt=(k,i)=>{if(confirm("Delete this prompt?")){data.prompts[k].splice(i,1);save();render()}};
window.addAudio=k=>{let t=document.getElementById("at-"+k),n=document.getElementById("an-"+k);if(!t.value.trim())return;(data.audio[k]??=[]).push({title:t.value.trim(),note:n.value.trim()});save();render();toast("Track added")};
window.delAudio=(k,i)=>{data.audio[k].splice(i,1);save();render()};
function download(){let payload={app:"YouTube Music Library",version:2,exportedAt:new Date().toISOString(),data};let b=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="youtube-music-library-backup.json";a.click();URL.revokeObjectURL(a.href)}
exportBtn.onclick=download;importBtn.onclick=()=>importFile.click();importFile.onchange=async e=>{try{let j=JSON.parse(await e.target.files[0].text()),d=j.data||j;if(!d.prompts||!d.audio)throw 0;if(confirm("Import will replace current browser data. Continue?")){data={prompts:d.prompts,audio:d.audio};save();render();toast("Backup imported")}}catch(x){alert("Invalid backup file.")}e.target.value=""};
addEventListener("hashchange",render);render();