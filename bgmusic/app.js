const catalog=[
{name:"City",subs:["Trains","Police","Fire","Construction","Vehicles","Space","Airport","Harbor","Food","Jungle / Exploration"]},
{name:"Technic",subs:["Cars","Motorcycles","Construction","Racing","Space","Aircraft"]},
{name:"Icons / Ideas",subs:["Cozy Buildings & Interiors","Elegant / Historic","Playful / Quirky","Retro / Nostalgia","Vehicles / Engineering","Nature / Decorative","Cinematic / Pop Culture","Medieval / Castle / Fantasy"]},
{name:"Creator 3in1",subs:["Animals","Vehicles","Buildings","Space"]},{name:"Speed Champions",subs:["Supercars","Racing","Formula 1"]},
{name:"Friends",subs:["Adventure","Animals","City Life","Food","Travel"]},{name:"NINJAGO",subs:["Dragons","Mechs","Vehicles","Temples"]},
{name:"Star Wars",subs:["Imperial / Dark Space","Jedi / Force / Mystical","Space Battle / Action","Rebel / Adventure","Mandalorian / Bounty Hunters","Droids / Light & Playful","Display / Collectors"]},{name:"Pokémon",subs:["Trainer Journey / Classic Adventure","Pokémon Creatures / Character Display","Battle / Action"]},{name:"Minecraft",subs:["Biomes","Mobs","Buildings","Adventure"]},
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
  ],
  "star-wars__imperial-dark-space": [
  {
    "text": "01 – Imperial Void\n\nCreate a dark cinematic electronic instrumental background track for long step-by-step sci-fi building instructions featuring a massive authoritarian space warship.\n\nMood: imposing, cold, mysterious, controlled and powerful.\n\nUse deep atmospheric synth pads, restrained electronic percussion, low pulsing bass, subtle metallic textures and distant cinematic drones.\n\nAround 82 BPM.\n\nMaintain a slow steady pulse and very consistent dynamics. The music should suggest the enormous scale of a dark spacecraft moving silently through deep space while remaining unobtrusive behind instruction pages changing every five seconds.\n\nAvoid heroic melodies, dramatic orchestral climaxes, large drops, jump scares and aggressive industrial noise.\n\nInstrumental only. No vocals, no spoken words. Do not imitate or reference any existing movie soundtrack, franchise theme or recognizable melody. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "02 – Dark Fleet\n\nCreate a dark futuristic instrumental background track for long building instructions featuring a fleet of massive military spacecraft.\n\nStyle: cinematic ambient electronic.\n\nMood: serious, controlled, technological, ominous and spacious.\n\nUse deep synth pads, slow electronic pulses, subtle low percussion, soft metallic accents and restrained bass.\n\nAround 86 BPM.\n\nKeep the arrangement smooth and repetitive with gradual subtle evolution rather than dramatic changes. Maintain consistent volume and intensity throughout.\n\nThe music should feel like an enormous fleet traveling through deep space.\n\nAvoid recognizable film music, brass fanfares, aggressive battle music, dramatic transitions and prominent lead melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "03 – Executor Drift\n\nCreate a slow dark instrumental background track for step-by-step building instructions featuring an enormous futuristic flagship traveling through deep space.\n\nStyle: deep space ambient with subtle electronic rhythm.\n\nMood: monumental, mysterious, cold, calm and intimidating.\n\nUse deep drones, wide atmospheric pads, minimal electronic pulses, distant metallic resonance and very soft low-frequency percussion.\n\nAround 76 BPM.\n\nKeep the track spacious and highly consistent, with gradual texture changes suitable for very long instructional videos.\n\nAvoid intense action, strong melodies, orchestral themes, drops and dramatic crescendos.\n\nInstrumental only. No vocals. Do not imitate any existing science-fiction soundtrack or recognizable franchise music.",
    "generated": false,
    "approved": false
  },
  {
    "text": "04 – Imperial Machine\n\nCreate a dark minimal electronic instrumental background track for long sci-fi building instructions.\n\nStyle: restrained industrial electronic with cinematic atmosphere.\n\nMood: mechanical, precise, disciplined, cold and powerful.\n\nUse subtle metallic percussion, deep synth bass, repeating electronic pulses, muted industrial textures and dark atmospheric pads.\n\nAround 90 BPM.\n\nCreate a steady mechanical rhythm suggesting an enormous advanced military machine operating with perfect precision.\n\nKeep the dynamics consistent and unobtrusive for instruction pages changing every five seconds.\n\nAvoid harsh industrial noise, aggressive distortion, big drops and recognizable movie themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "05 – Shadow Command\n\nCreate a dark atmospheric instrumental background track for long step-by-step sci-fi building instructions.\n\nStyle: melodic ambient electronic with restrained cinematic elements.\n\nMood: commanding, mysterious, intelligent, cold and sophisticated.\n\nUse deep warm synth pads, subtle arpeggiated pulses, soft low percussion, restrained bass and a very simple original minor-key motif.\n\nAround 80 BPM.\n\nKeep the melody understated and repetitive, with slow subtle variations and consistent energy.\n\nAvoid dramatic orchestral writing, heroic themes, strong hooks and recognizable science-fiction melodies.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "06 – Black Hull\n\nCreate a dark futuristic instrumental background track for detailed spacecraft building instructions.\n\nStyle: very restrained dark synthwave blended with cinematic ambient.\n\nMood: cold, technological, mysterious, heavy and controlled.\n\nUse deep analog-style synth pads, slow pulsing bass, subtle electronic drums, dark arpeggios and distant metallic ambience.\n\nAround 88 BPM.\n\nKeep the rhythm steady and subdued rather than dance-oriented. Maintain similar energy throughout the track.\n\nAvoid retro arcade sounds, bright synth leads, dramatic drops and recognizable movie soundtrack elements.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "07 – Deep Space Authority\n\nCreate a slow ominous instrumental background track for long building instructions featuring a massive dark military spacecraft.\n\nStyle: cinematic drone with minimal electronic pulse.\n\nMood: vast, imposing, controlled, mysterious and quiet.\n\nUse deep evolving drones, low synth pulses, subtle sub bass, distant metallic textures and sparse soft percussion.\n\nAround 74 BPM.\n\nThe track should feel enormous without becoming loud or dramatic. Maintain a continuous calm tension suitable for long instructional sequences.\n\nAvoid jump scares, orchestral crescendos, battle drums, recognizable franchise themes and strong melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "08 – Imperial Systems\n\nCreate a restrained futuristic instrumental background track for long step-by-step spacecraft building instructions.\n\nStyle: minimal electronic with subtle cinematic and techno influences.\n\nMood: precise, technical, controlled, efficient and dark.\n\nUse soft electronic pulses, muted kick and percussion, deep bass, minimal synth patterns and atmospheric pads.\n\nAround 94 BPM.\n\nMaintain a clean repetitive groove suggesting complex technological systems operating deep inside a massive spacecraft.\n\nKeep dynamics consistent and background-friendly.\n\nAvoid club-style drops, aggressive techno, bright melodies and recognizable soundtrack motifs.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "09 – Silent Destroyer\n\nCreate a very calm dark instrumental background track for long building instructions featuring a massive futuristic destroyer in deep space.\n\nStyle: cinematic space ambient.\n\nMood: silent, enormous, distant, cold and mysterious.\n\nUse expansive synth pads, deep drones, subtle low pulses, faint metallic resonance and minimal percussion.\n\nAround 70 BPM.\n\nAllow the track to evolve slowly through textures rather than melody. Keep a steady understated atmosphere throughout.\n\nAvoid dramatic action, strong rhythm changes, orchestral themes and recognizable science-fiction music.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "10 – Command Deck\n\nCreate a dark but calm instrumental electronic background track for long sci-fi building instructions.\n\nStyle: dark electronic chill with subtle cinematic atmosphere.\n\nMood: focused, technological, disciplined, intelligent and slightly ominous.\n\nUse smooth synth pads, subtle repeating arpeggios, soft electronic drums, warm low bass and quiet metallic accents.\n\nAround 92 BPM.\n\nCreate the feeling of working inside the command deck of an enormous futuristic spacecraft.\n\nMaintain consistent volume and energy while instruction pages change every five seconds.\n\nAvoid dramatic soundtrack moments, strong lead melodies and aggressive percussion.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "11 – Outer Rim Darkness\n\nCreate a dark atmospheric instrumental background track for long step-by-step spacecraft building instructions.\n\nStyle: cinematic ambient electronic.\n\nMood: remote, mysterious, cold, spacious and quietly threatening.\n\nUse airy dark pads, deep bass drones, subtle electronic pulses, distant percussive echoes and gentle evolving textures.\n\nAround 78 BPM.\n\nKeep the arrangement minimal and spacious, with small gradual changes to prevent repetition during long videos.\n\nAvoid recognizable movie melodies, dramatic crescendos, action percussion and orchestral fanfares.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "12 – Imperial Assembly\n\nCreate a steady dark instrumental background track for long building instructions featuring the construction and assembly of a massive futuristic warship.\n\nStyle: mechanical electronic chill.\n\nMood: productive, precise, industrial, controlled and futuristic.\n\nUse soft mechanical percussion, repeating synth plucks, low warm bass, subtle electronic drums and dark atmospheric pads.\n\nAround 96 BPM.\n\nKeep a steady work-like rhythm without sounding playful or upbeat. Maintain consistent dynamics throughout.\n\nAvoid aggressive industrial music, heavy distortion, drops and recognizable cinematic themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "13 – Dark Orbit\n\nCreate a dark melodic instrumental background track for long sci-fi building instructions.\n\nStyle: ambient electronic with subtle cinematic melody.\n\nMood: mysterious, elegant, powerful, distant and controlled.\n\nUse dark synth pads, gentle arpeggiated notes, smooth low bass, soft percussion and a restrained original minor-key motif.\n\nAround 84 BPM.\n\nThe melody should remain understated and atmospheric rather than memorable or dominant.\n\nMaintain consistent energy suitable for instruction pages changing every five seconds.\n\nAvoid recognizable soundtrack melodies, dramatic rises and heroic elements.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "14 – Steel in Space\n\nCreate a dark futuristic instrumental background track for detailed spacecraft building instructions.\n\nStyle: industrial ambient with restrained electronic rhythm.\n\nMood: metallic, heavy, technological, calm and imposing.\n\nUse muted metallic percussion, low synth drones, soft rhythmic pulses, deep bass and wide atmospheric textures.\n\nAround 88 BPM.\n\nSuggest the enormous metallic structure of a military spacecraft without using realistic machinery or harsh industrial effects.\n\nKeep the track smooth and consistent.\n\nAvoid dramatic transitions, heavy distortion, intense action music and recognizable film themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "15 – Imperial Night\n\nCreate a calm dark instrumental background track for long step-by-step sci-fi building instructions.\n\nStyle: dark cinematic chill electronic.\n\nMood: nocturnal, mysterious, controlled, elegant and quietly powerful.\n\nUse warm dark synth pads, gentle bass pulses, subtle electronic drums, atmospheric textures and occasional soft metallic accents.\n\nAround 80 BPM.\n\nKeep the arrangement smooth, repetitive and unobtrusive with subtle variation across the track.\n\nAvoid dramatic tension spikes, strong melodic hooks, orchestral climaxes and recognizable soundtrack material.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "16 – Starship Core\n\nCreate a dark technological instrumental background track for long spacecraft building instructions.\n\nStyle: deep electronic pulse with cinematic ambient atmosphere.\n\nMood: focused, mechanical, futuristic, powerful and controlled.\n\nUse repeating low synth pulses, deep bass, subtle rhythmic percussion, atmospheric pads and quiet digital textures.\n\nAround 90 BPM.\n\nCreate the feeling of an enormous spacecraft reactor and internal systems operating steadily.\n\nMaintain consistent volume and rhythm suitable for very long instructional videos.\n\nAvoid alarms, harsh machine effects, dramatic buildups and recognizable science-fiction themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "17 – Dreadnought Passage\n\nCreate a slow dark instrumental background track for long step-by-step building instructions featuring a gigantic futuristic dreadnought.\n\nStyle: cinematic electronic ambient.\n\nMood: massive, solemn, mysterious, restrained and intimidating.\n\nUse very deep pads, soft low percussion, subtle synth pulses, distant metallic reverberation and understated bass.\n\nAround 76 BPM.\n\nEmphasize scale through spacious sound design rather than loudness or dramatic orchestration.\n\nKeep dynamics stable and transitions gradual.\n\nAvoid recognizable movie soundtrack motifs, brass fanfares, dramatic crescendos and aggressive action music.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "18 – Tactical Grid\n\nCreate a dark precise instrumental background track for long sci-fi building instructions.\n\nStyle: minimal futuristic electronic.\n\nMood: tactical, organized, focused, technical and controlled.\n\nUse clean repeating synth patterns, muted electronic percussion, low bass pulses, subtle digital textures and dark ambient pads.\n\nAround 98 BPM.\n\nKeep the groove predictable and consistent, suggesting a sophisticated tactical computer system without sounding like video game music.\n\nAvoid dramatic drops, fast action sequences, bright melodies and recognizable franchise themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "19 – Eclipse Fleet\n\nCreate a deep dark instrumental background track for long spacecraft building instructions.\n\nStyle: cinematic dark ambient with minimal electronic elements.\n\nMood: vast, ominous, elegant, quiet and mysterious.\n\nUse very wide atmospheric pads, deep drones, occasional soft electronic pulses, distant metallic tones and minimal bass movement.\n\nAround 72 BPM.\n\nCreate an atmosphere of enormous spacecraft slowly emerging from darkness.\n\nKeep the track calm and consistent enough for prolonged instructional use.\n\nAvoid horror effects, sudden impacts, dramatic orchestral moments and recognizable movie themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "20 – Imperial Horizon\n\nCreate a dark cinematic electronic instrumental background track for long step-by-step sci-fi building instructions.\n\nStyle: melodic cinematic electronic with ambient space textures.\n\nMood: powerful, mysterious, sophisticated, futuristic and restrained.\n\nUse deep atmospheric pads, subtle repeating synth arpeggios, warm low bass, light electronic percussion and a simple original minor-key melodic phrase.\n\nAround 86 BPM.\n\nMaintain steady low-intensity momentum with gradual subtle variations so the track remains interesting across long instructional videos without becoming distracting.\n\nAvoid heroic themes, recognizable soundtrack melodies, orchestral climaxes, drops and aggressive percussion.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  }
],
  "star-wars__display-collectors": [
  {
    "text": "01 – Collector’s Chamber\n\nCreate a slow elegant instrumental background track for long step-by-step building instructions featuring a premium sci-fi collector display model.\n\nStyle: cinematic chill with ambient electronic textures.\nMood: refined, spacious, mysterious, calm and sophisticated.\nUse warm atmospheric pads, soft piano notes, restrained low strings, subtle electronic pulses and very light percussion.\nAround 78 BPM.\n\nKeep the arrangement smooth, minimal and consistent so it stays unobtrusive while instruction pages change every five seconds. Create a museum-like sense of scale and importance without becoming dramatic.\n\nAvoid recognizable movie themes, heroic fanfares, large crescendos, heavy bass and strong lead melodies.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "02 – Saber Relic\n\nCreate a calm cinematic ambient instrumental background track for step-by-step building instructions featuring a collectible sci-fi energy sword display.\n\nStyle: ambient cinematic chill with subtle electronic details.\nMood: elegant, mysterious, focused, iconic and restrained.\nUse airy synth pads, soft low piano, delicate metallic textures, a gentle bass pulse and sparse atmospheric percussion.\nAround 76 BPM.\n\nMaintain steady low-intensity energy and gradual texture changes suitable for a long building tutorial. The music should suggest a powerful ancient technological relic without using sound effects.\n\nAvoid recognizable franchise melodies, dramatic orchestral writing, battle music, drops and attention-grabbing solos.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "03 – 40897 Dark Relic Display\n\nCreate a dark refined instrumental background track for long step-by-step building instructions featuring a black-and-red sci-fi energy sword collector display.\n\nStyle: dark cinematic chill with minimal electronic pulse.\nMood: controlled, elegant, ominous, premium and mysterious.\nUse deep atmospheric pads, restrained low synth pulses, subtle metallic resonance, soft bass and sparse cinematic percussion.\nAround 74 BPM.\n\nKeep the dynamics very consistent and the melody minimal. The track should feel powerful and prestigious while remaining quiet enough for instruction pages changing every five seconds.\n\nDo not imitate or reference any existing movie score, character theme or recognizable franchise melody. Avoid dramatic rises, aggressive action rhythms and heavy industrial sounds.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "04 – 40897 Shadow Blade\n\nCreate a slow atmospheric instrumental background track for detailed building instructions featuring a dark sci-fi collector energy blade.\n\nStyle: ambient electronic with subtle cinematic tension.\nMood: shadowy, precise, elegant, calm and imposing.\nUse dark synth pads, low warm drones, a very soft repeating pulse, distant metallic textures and minimal percussion.\nAround 72 BPM.\n\nMaintain a smooth continuous atmosphere with subtle evolution rather than obvious sections. Keep volume and intensity stable for long instructional use.\n\nAvoid recognizable soundtrack motifs, horror effects, dramatic impacts, fast rhythms and dominant melodies.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "05 – Helmet Gallery\n\nCreate a sophisticated instrumental background track for step-by-step building instructions featuring collectible sci-fi helmets and display pieces.\n\nStyle: cinematic ambient chill with modern electronic production.\nMood: clean, prestigious, futuristic, calm and slightly mysterious.\nUse soft pads, restrained electronic arpeggios, warm low bass, subtle metallic accents and very light percussion.\nAround 82 BPM.\n\nKeep a steady elegant flow with small gradual variations. The music should feel suitable for a premium display gallery and remain unobtrusive behind instruction pages changing every five seconds.\n\nAvoid heroic themes, recognizable movie music, dramatic transitions and aggressive percussion.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "06 – Black Pedestal\n\nCreate a minimal dark instrumental background track for long collector-model building instructions.\n\nStyle: minimalist cinematic electronic.\nMood: premium, dark, architectural, controlled and quiet.\nUse deep soft pads, sparse piano notes, subtle low pulses, muted electronic percussion and wide ambient textures.\nAround 70 BPM.\n\nCreate the feeling of a carefully lit display object on a black museum pedestal. Maintain very consistent dynamics and a restrained arrangement throughout.\n\nAvoid action music, dramatic crescendos, heavy bass, bright synth leads and recognizable franchise melodies.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "07 – Museum of Stars\n\nCreate a spacious elegant instrumental background track for long step-by-step sci-fi display model building instructions.\n\nStyle: cinematic ambient with gentle electronic and acoustic textures.\nMood: timeless, reflective, sophisticated, spacious and quietly inspiring.\nUse warm piano, airy pads, subtle strings, delicate synth plucks and very light percussion.\nAround 80 BPM.\n\nKeep the music slow-moving and consistent, with understated melodic fragments and gradual texture changes. It should support long instruction videos without drawing attention away from the build.\n\nAvoid recognizable soundtrack themes, emotional orchestral climaxes, strong hooks and dramatic rhythm changes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "08 – Diorama Silence\n\nCreate a calm atmospheric instrumental background track for step-by-step building instructions featuring a detailed sci-fi diorama display.\n\nStyle: ambient cinematic chill.\nMood: immersive, quiet, detailed, mysterious and contemplative.\nUse soft environmental-style synth pads, warm low tones, subtle piano notes, gentle electronic pulses and sparse percussion.\nAround 74 BPM.\n\nMaintain a smooth continuous flow with very subtle variation. The music should create atmosphere without suggesting a specific scene or existing film soundtrack.\n\nAvoid battle music, recognizable melodies, dramatic swells, sudden impacts and heavy percussion.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "09 – Collector’s Shelf\n\nCreate a relaxed premium instrumental background track for long building instructions featuring collectible sci-fi display models.\n\nStyle: cinematic lounge ambient with light electronic elements.\nMood: polished, calm, modern, tasteful and slightly futuristic.\nUse warm electric piano, smooth synth pads, soft bass, restrained electronic percussion and delicate atmospheric plucks.\nAround 84 BPM.\n\nKeep a steady low-key groove and consistent dynamics while instruction pages change every five seconds. The track should feel sophisticated but never distracting.\n\nAvoid club rhythms, strong hooks, dramatic soundtrack moments and recognizable franchise material.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "10 – Legacy Display\n\nCreate a slow cinematic instrumental background track for step-by-step building instructions featuring a prestigious sci-fi collector model.\n\nStyle: cinematic chill with restrained orchestral and electronic layers.\nMood: timeless, dignified, mysterious, calm and monumental.\nUse soft low strings, warm atmospheric pads, subtle piano, gentle bass pulses and minimal percussion.\nAround 76 BPM.\n\nSuggest history and importance through texture and harmony rather than loudness. Keep transitions gradual and dynamics stable for long instructional videos.\n\nAvoid heroic fanfares, recognizable film themes, dramatic crescendos and dominant melodies.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "11 – Galactic Blueprint\n\nCreate a clean precise instrumental background track for detailed sci-fi collector building instructions.\n\nStyle: ambient electronic chill with subtle technical rhythm.\nMood: focused, modern, elegant, precise and spacious.\nUse soft repeating synth patterns, smooth pads, gentle low bass, subtle digital textures and understated percussion.\nAround 86 BPM.\n\nCreate the feeling of studying a futuristic blueprint while assembling a premium display model. Maintain a predictable rhythm and consistent energy throughout.\n\nAvoid video-game sounds, club-style beats, dramatic drops and recognizable soundtrack motifs.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "12 – Monument in Orbit\n\nCreate a spacious cinematic ambient instrumental background track for long step-by-step building instructions featuring a large premium sci-fi display model.\n\nStyle: deep ambient cinematic chill.\nMood: monumental, serene, mysterious, elegant and vast.\nUse wide synth pads, soft drones, minimal low percussion, subtle piano accents and gentle bass movement.\nAround 70 BPM.\n\nEmphasize scale through space and texture rather than volume. Keep the music smooth and restrained with gradual changes suitable for very long tutorials.\n\nAvoid dramatic orchestral climaxes, battle rhythms, recognizable franchise melodies and sudden transitions.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "13 – Quiet Showcase\n\nCreate a soft modern instrumental background track for step-by-step building instructions featuring sci-fi helmets, logos, dioramas and collector display pieces.\n\nStyle: ambient electronic chill.\nMood: clean, understated, polished, calm and futuristic.\nUse warm pads, subtle synth plucks, smooth bass, light electronic percussion and sparse piano accents.\nAround 82 BPM.\n\nMaintain a simple repeating structure, consistent volume and gentle variation so the track remains useful across many different collector sets.\n\nAvoid dramatic storytelling, strong lead themes, heavy bass and recognizable movie soundtrack elements.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "14 – Archive Display\n\nCreate an elegant atmospheric instrumental background track for long sci-fi collector building instructions.\n\nStyle: cinematic ambient with soft electronic pulse.\nMood: archival, mysterious, premium, reflective and calm.\nUse deep warm pads, gentle repeating pulses, subtle low piano, delicate metallic textures and minimal percussion.\nAround 78 BPM.\n\nCreate the feeling of a valuable artifact preserved in a futuristic archive. Keep the music restrained, repetitive and consistent while instruction pages change every five seconds.\n\nAvoid recognizable franchise themes, dramatic orchestration, aggressive rhythms, drops and strong melodic hooks.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  }
],
  "pokemon__trainer-journey-classic-adventure": [
  {
    "text": "01 – First Trainer Steps\n\nCreate a bright instrumental background track for step-by-step building instructions featuring the beginning of a trainer adventure in a colorful creature-filled world.\n\nStyle: melodic adventure chill with light electronic and acoustic elements.\nMood: positive, clean, hopeful, curious and family-friendly.\nUse soft piano, light guitar, gentle synth plucks, smooth bass and light percussion.\nAround 98 BPM.\n\nKeep the rhythm steady and unobtrusive so it works well while instruction pages change every five seconds. Suggest the excitement of starting a new journey without becoming dramatic.\n\nAvoid imitation of any existing game, anime or franchise music. No recognizable melodies. Instrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "02 – Adventure Begins\n\nCreate a cheerful instrumental background track for long building instructions featuring a classic trainer journey and the beginning of an adventure.\n\nStyle: cinematic chill pop with subtle electronic textures.\nMood: optimistic, adventurous, light, warm and clean.\nUse piano, acoustic guitar, airy pads, soft electronic drums and a gentle bass line.\nAround 102 BPM.\n\nMaintain a smooth steady flow with small variations and consistent dynamics. The music should feel adventurous but stay comfortably in the background.\n\nAvoid dramatic action scoring, recognizable melodies and heavy drops. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "03 – Pocket World Morning\n\nCreate a soft adventurous instrumental background track for step-by-step building instructions featuring a bright fantasy creature world and a trainer setting out on a journey.\n\nStyle: acoustic-electronic adventure chill.\nMood: fresh, cheerful, peaceful and full of discovery.\nUse fingerpicked guitar, warm piano, light synth textures, subtle percussion and soft bass.\nAround 94 BPM.\n\nKeep the structure simple and repetitive with very consistent energy while instruction pages change every five seconds.\n\nDo not imitate any existing soundtrack or theme. No vocals. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "04 – Poké Ball Quest\n\nCreate a clean melodic instrumental background track for detailed building instructions featuring an iconic trainer item display and the spirit of classic adventure.\n\nStyle: melodic cinematic chill.\nMood: adventurous, polished, positive, nostalgic and calm.\nUse warm pads, piano, subtle bells, soft percussion and a smooth bass pulse.\nAround 96 BPM.\n\nMaintain a balanced and unobtrusive arrangement suitable for long instructions. Suggest a classic journey and collectible world without becoming too emotional.\n\nAvoid recognizable franchise melodies, dramatic crescendos and heavy percussion. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "05 – Friendly Route\n\nCreate a light instrumental background track for step-by-step building instructions featuring a trainer exploring a peaceful route in a magical creature world.\n\nStyle: light electronic adventure pop.\nMood: friendly, clean, upbeat, curious and easygoing.\nUse bright synth plucks, acoustic guitar, soft bass and light electronic drums.\nAround 104 BPM.\n\nKeep a steady gentle groove and consistent dynamics. The track should feel mobile and adventurous while staying subtle in the background.\n\nAvoid battle intensity, strong hooks and recognizable game or anime melodies. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "06 – Journey Through Grasslands\n\nCreate a calm positive instrumental background track for long building instructions featuring a trainer journey through a colorful natural world.\n\nStyle: ambient adventure chill with acoustic elements.\nMood: warm, open, exploratory, gentle and optimistic.\nUse soft piano, acoustic guitar, airy synth pads, subtle percussion and warm bass.\nAround 92 BPM.\n\nMaintain a smooth repetitive flow and soft dynamics throughout. The music should support a long tutorial without distracting from the build.\n\nAvoid imitation of existing franchise music or any recognizable game theme. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "07 – New Companion\n\nCreate a gentle uplifting instrumental background track for step-by-step building instructions featuring a classic creature-training adventure and a new companion.\n\nStyle: melodic chill with acoustic-electronic production.\nMood: heartwarming, playful, hopeful and relaxed.\nUse piano, soft guitar, light synth plucks, subtle bells and gentle percussion.\nAround 100 BPM.\n\nKeep the rhythm even and predictable with small melodic variations. The track should remain background-friendly for instruction pages changing every five seconds.\n\nAvoid dramatic soundtrack writing and recognizable franchise melodies. Instrumental only. No vocals. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "08 – Trainer’s Road\n\nCreate an elegant positive instrumental background track for long building instructions featuring a collectible trainer-themed set and a journey motif.\n\nStyle: cinematic electronic chill.\nMood: adventurous, refined, steady, bright and welcoming.\nUse soft pads, piano, subtle arpeggios, warm bass and restrained percussion.\nAround 98 BPM.\n\nMaintain low-intensity momentum and consistent volume across the track. The music should feel like steady travel through a colorful world.\n\nAvoid sharp transitions, heroic fanfares and imitation of existing game or anime soundtracks. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "09 – World of Discovery\n\nCreate a bright atmospheric instrumental background track for step-by-step building instructions featuring a trainer discovering a magical creature world.\n\nStyle: ambient melodic adventure.\nMood: open, uplifting, curious, peaceful and lightly nostalgic.\nUse piano, airy pads, soft synth leads, gentle percussion and smooth bass.\nAround 95 BPM.\n\nKeep the arrangement clean and unobtrusive with gradual development and a simple original melodic idea.\n\nAvoid recognizable franchise themes, battle music and heavy drops. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "10 – 72154 Iconic Trainer Moments Poké Ball\n\nCreate a polished instrumental background track for long building instructions featuring an iconic collectible ball display linked to a trainer adventure theme.\n\nStyle: premium cinematic chill with light electronic textures.\nMood: classic, adventurous, clean, calm and slightly magical.\nUse warm piano, soft atmospheric pads, delicate bells, light percussion and a restrained bass pulse.\nAround 90 BPM.\n\nKeep the music steady and elegant, suitable for a display-style tutorial while still suggesting the start of an adventure.\n\nAvoid imitation of existing franchise melodies or game soundtrack material. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  }
],
  "pokemon__pokemon-creatures-character-display": [
  {
    "text": "01 – Gentle Creature Display\n\nCreate a soft instrumental background track for step-by-step building instructions featuring a cute collectible creature display model.\n\nStyle: magical ambient chill with light acoustic and electronic elements.\nMood: gentle, charming, cozy, playful and calm.\nUse soft bells, piano, light pads, subtle plucks and gentle percussion.\nAround 88 BPM.\n\nKeep the arrangement smooth and unobtrusive while instruction pages change every five seconds. The track should feel cute and magical without becoming childish or silly.\n\nAvoid imitation of existing game, anime or franchise music. No recognizable melodies. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "02 – Forest Companion\n\nCreate a calm melodic instrumental background track for long building instructions featuring a lovable fantasy creature display.\n\nStyle: acoustic-electronic chill.\nMood: warm, peaceful, sweet, lightly magical and friendly.\nUse acoustic guitar, soft piano, airy pads, subtle glockenspiel and gentle bass.\nAround 84 BPM.\n\nMaintain a steady relaxed flow with small variations and very consistent dynamics suitable for long tutorials.\n\nAvoid strong hooks, battle energy and recognizable franchise melodies. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "03 – Cozy Creature Shelf\n\nCreate a light elegant instrumental background track for step-by-step building instructions featuring a small creature character display for collectors.\n\nStyle: ambient chill with soft electronic textures.\nMood: cute, polished, relaxed, magical and family-friendly.\nUse warm pads, light synth plucks, soft bass, subtle percussion and occasional delicate piano notes.\nAround 86 BPM.\n\nKeep the music low-key and repetitive so it supports the visual build without distracting.\n\nAvoid imitation of existing soundtrack material or famous melodies. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "04 – Eevee Afternoon\n\nCreate a warm charming instrumental background track for long building instructions featuring a cute fox-like fantasy creature display.\n\nStyle: acoustic cinematic chill.\nMood: adorable, gentle, sunny, soft and comforting.\nUse fingerpicked guitar, warm piano, soft bells, light percussion and smooth bass.\nAround 90 BPM.\n\nMaintain even energy and a cozy background feel suitable for page changes every five seconds.\n\nAvoid direct references to existing character themes or game music. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "05 – Arcanine Rest\n\nCreate a calm majestic instrumental background track for step-by-step building instructions featuring a large noble creature display model.\n\nStyle: ambient melodic chill.\nMood: calm, proud, warm, magical and elegant.\nUse soft piano, airy pads, light strings, gentle percussion and a steady bass pulse.\nAround 82 BPM.\n\nKeep the arrangement spacious and smooth, suggesting a dignified creature presence without becoming dramatic.\n\nAvoid heroic soundtrack writing and recognizable franchise melodies. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "06 – Sky Serpent Display\n\nCreate a mystical instrumental background track for long building instructions featuring a long legendary sky creature display model.\n\nStyle: cinematic ambient chill with subtle electronic textures.\nMood: magical, serene, majestic, airy and contemplative.\nUse airy synth pads, soft bells, low drones, delicate percussion and gentle bass movement.\nAround 80 BPM.\n\nMaintain a slow elegant flow with gradual changes and consistent dynamics suitable for a display-focused tutorial.\n\nAvoid epic battle scoring and imitation of existing game or anime music. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "07 – Creature Portrait\n\nCreate a soft playful instrumental background track for step-by-step building instructions featuring a single fantasy creature as a collector display.\n\nStyle: melodic chill pop with magical details.\nMood: cute, bright, polished, easygoing and lightly whimsical.\nUse piano, soft synth plucks, bells, smooth bass and subtle electronic drums.\nAround 92 BPM.\n\nKeep the track steady and background-friendly while instruction pages change every five seconds.\n\nAvoid cartoon comedy music, strong hooks and recognizable franchise melodies. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "08 – Collector Creature Glow\n\nCreate an elegant calm instrumental background track for long building instructions featuring a premium creature display model.\n\nStyle: ambient electronic chill.\nMood: peaceful, magical, polished, modern and comforting.\nUse smooth pads, subtle arpeggios, soft piano, gentle percussion and warm bass.\nAround 87 BPM.\n\nMaintain a clean repetitive structure and consistent volume throughout.\n\nAvoid battle intensity, dramatic crescendos and imitation of existing soundtrack material. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "09 – Pocket Creature Dream\n\nCreate a dreamy instrumental background track for step-by-step building instructions featuring a cute and magical creature display.\n\nStyle: dreamy acoustic-electronic ambient.\nMood: sweet, relaxed, magical, innocent and calm.\nUse light piano, soft guitar, airy pads, tiny bell accents and a gentle low end.\nAround 78 BPM.\n\nKeep the track minimal and serene, with subtle variations suited to long instruction videos.\n\nAvoid recognizable game or anime melodies, big transitions and heavy percussion. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "10 – Creature Collection\n\nCreate a soft premium instrumental background track for long building instructions featuring collectible creature characters displayed on a shelf.\n\nStyle: cinematic chill with light magical textures.\nMood: elegant, cute, calm, refined and family-friendly.\nUse warm piano, subtle strings, soft synth pads, delicate percussion and smooth bass.\nAround 85 BPM.\n\nKeep the arrangement consistent and non-distracting while still feeling magical and collectible.\n\nAvoid strong lead melodies, dramatic storytelling and imitation of existing franchise soundtrack elements. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },

  {
    "text": "11 – Crystal Creature Glow\n\nCreate a calm magical instrumental background track for long step-by-step building instructions featuring a premium collectible fantasy creature display.\n\nStyle: ambient melodic chill with soft crystalline textures.\nMood: serene, magical, polished, gentle and slightly mysterious.\nUse airy pads, soft bell-like plucks, warm piano, smooth bass and very light percussion.\nAround 84 BPM.\n\nKeep the arrangement spacious, repetitive and consistent, with subtle gradual variation suitable for very long instruction videos.\n\nAvoid dramatic crescendos, strong hooks, battle energy and any recognizable game or anime melodies.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "12 – Meadow Companion\n\nCreate a warm relaxed instrumental background track for step-by-step building instructions featuring a friendly collectible creature display.\n\nStyle: acoustic ambient chill.\nMood: peaceful, charming, sunny, gentle and comforting.\nUse soft acoustic guitar, warm piano, subtle pads, delicate percussion and a smooth bass line.\nAround 86 BPM.\n\nMaintain a steady low-key flow with consistent dynamics while instruction pages change every five seconds.\n\nAvoid overly playful cartoon music, dramatic changes and recognizable franchise melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "13 – Legendary Presence\n\nCreate an elegant instrumental background track for long building instructions featuring a large legendary fantasy creature display model.\n\nStyle: cinematic ambient chill with restrained orchestral textures.\nMood: majestic, calm, mysterious, refined and powerful without becoming dramatic.\nUse soft low strings, airy pads, subtle piano, gentle bass pulses and sparse percussion.\nAround 80 BPM.\n\nSuggest scale and importance through atmosphere rather than loudness. Keep the track steady and unobtrusive for long tutorials.\n\nAvoid epic battle scoring, heroic fanfares, dramatic climaxes and recognizable soundtrack material.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "14 – Gentle Evolution\n\nCreate a soft melodic instrumental background track for step-by-step building instructions featuring a charming fantasy creature character.\n\nStyle: melodic acoustic-electronic chill.\nMood: warm, optimistic, cute, lightly magical and calm.\nUse soft piano, fingerpicked guitar, gentle synth plucks, delicate bells and understated percussion.\nAround 90 BPM.\n\nKeep the melody simple and subtle with a smooth repeating rhythm and consistent energy.\n\nAvoid strong emotional swells, catchy pop hooks and recognizable game or anime melodies.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "15 – Sky Creature Drift\n\nCreate a spacious instrumental background track for long building instructions featuring a flying or dragon-like fantasy creature display.\n\nStyle: airy cinematic ambient with light electronic elements.\nMood: floating, serene, majestic, magical and open.\nUse wide atmospheric pads, gentle arpeggios, soft piano accents, subtle low bass and minimal percussion.\nAround 82 BPM.\n\nMaintain a smooth drifting feel and very consistent dynamics, suitable for long-form building instructions.\n\nAvoid intense action, dramatic orchestration, heavy drums and recognizable franchise themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "16 – Cozy Collector Corner\n\nCreate a warm unobtrusive instrumental background track for step-by-step building instructions featuring collectible creature models displayed in a cozy room.\n\nStyle: soft lounge chill with acoustic and electronic textures.\nMood: cozy, polished, friendly, relaxed and lightly whimsical.\nUse warm electric piano, soft guitar, smooth pads, gentle bass and subtle brushed-style percussion.\nAround 88 BPM.\n\nKeep the groove very steady and low-key with small variations so it works comfortably behind instruction pages changing every five seconds.\n\nAvoid strong lead melodies, dramatic transitions and imitation of existing soundtrack music.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "17 – Moonlit Creature\n\nCreate a dreamy instrumental background track for long step-by-step building instructions featuring a mysterious fantasy creature display.\n\nStyle: dreamy ambient electronic.\nMood: calm, nocturnal, magical, elegant and gentle.\nUse soft synth pads, delicate bell tones, low warm bass, sparse piano and very light electronic percussion.\nAround 78 BPM.\n\nKeep the track minimal and slowly evolving, with stable volume and no sudden changes.\n\nAvoid dark horror moods, dramatic tension, battle elements and recognizable game or anime themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "18 – Bright Character Display\n\nCreate a cheerful but calm instrumental background track for building instructions featuring a colorful fantasy creature character model.\n\nStyle: light melodic chill pop with soft electronic production.\nMood: bright, friendly, playful, clean and relaxed.\nUse gentle synth plucks, warm piano, soft bass, light electronic drums and subtle percussion.\nAround 94 BPM.\n\nMaintain a steady repetitive groove and consistent energy suitable for long instructional videos.\n\nAvoid overly catchy lead melodies, cartoon comedy sounds, heavy drops and recognizable franchise music.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "19 – Ancient Creature Shrine\n\nCreate a calm atmospheric instrumental background track for long building instructions featuring a rare or legendary creature display.\n\nStyle: cinematic ambient chill with subtle mystical textures.\nMood: timeless, mysterious, peaceful, refined and magical.\nUse deep warm pads, soft bells, restrained strings, subtle low percussion and gentle bass movement.\nAround 76 BPM.\n\nCreate a sense of ancient significance while keeping the arrangement minimal and background-friendly.\n\nAvoid epic fantasy scoring, dramatic crescendos, battle drums and recognizable soundtrack motifs.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "20 – Creature Gallery Evening\n\nCreate a polished instrumental background track for long step-by-step building instructions featuring multiple collectible fantasy creature display models.\n\nStyle: premium ambient chill with light cinematic and electronic elements.\nMood: elegant, calm, magical, modern and soothing.\nUse warm pads, soft electric piano, subtle synth arpeggios, smooth bass and very light percussion.\nAround 84 BPM.\n\nKeep the structure repetitive and consistent with gradual tonal variation so it remains comfortable across very long tutorials.\n\nAvoid strong hooks, dramatic transitions, battle energy and imitation of any existing game or anime soundtrack.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  }

],
  "pokemon__battle-action": [
  {
    "text": "01 – Friendly Battle Arena\n\nCreate an energetic instrumental background track for step-by-step building instructions featuring a colorful creature battle set.\n\nStyle: cinematic electronic action chill.\nMood: lively, competitive, adventurous and exciting, but still family-friendly.\nUse punchy but soft electronic drums, bright synths, bass pulses and subtle cinematic pads.\nAround 112 BPM.\n\nKeep the energy steady and motivating while remaining suitable as background music for pages changing every five seconds.\n\nAvoid harsh aggression, heavy distortion and imitation of existing game or anime battle themes. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "02 – Trainer Challenge\n\nCreate a bright action-oriented instrumental background track for long building instructions featuring a trainer challenge and battle theme.\n\nStyle: melodic action electronic.\nMood: upbeat, determined, energetic and adventurous.\nUse rhythmic synth plucks, light electronic percussion, smooth bass and subtle cinematic textures.\nAround 114 BPM.\n\nMaintain a stable groove and consistent intensity without big drops or dramatic interruptions.\n\nAvoid recognizable franchise melodies, hard EDM and overly aggressive sounds. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "03 – Creature Clash\n\nCreate a dynamic instrumental background track for step-by-step building instructions featuring a fantasy creature showdown.\n\nStyle: electronic cinematic chill-action.\nMood: focused, active, playful, modern and lightly tense.\nUse rhythmic pulses, synth plucks, light percussion, bass drive and atmospheric pads.\nAround 110 BPM.\n\nKeep the flow continuous and background-friendly while giving a sense of movement and action.\n\nAvoid dark violence, harsh metal elements and imitation of existing soundtrack music. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "04 – Arena Sparks\n\nCreate a clean energetic instrumental background track for long building instructions featuring a colorful battle-themed fantasy creature set.\n\nStyle: modern melodic electronic.\nMood: sharp, exciting, positive and competitive.\nUse soft punchy drums, bright synth patterns, warm bass and restrained cinematic accents.\nAround 116 BPM.\n\nMaintain low-to-medium intensity with steady rhythm and only small variations. The track should feel active without overpowering the tutorial.\n\nAvoid recognizable anime or game battle themes, drops and hard club energy. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "05 – Swift Strategy\n\nCreate a rhythmic instrumental background track for step-by-step building instructions featuring tactical creature battles and quick action.\n\nStyle: light cinematic electro.\nMood: agile, focused, smart, upbeat and adventurous.\nUse tight electronic percussion, soft arpeggios, controlled bass and atmospheric pads.\nAround 108 BPM.\n\nKeep the groove clean and predictable so it supports long instruction viewing while still feeling lively.\n\nAvoid heavy aggression, dramatic orchestral battle scoring and recognizable franchise melodies. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "06 – Match Point Adventure\n\nCreate an uplifting action instrumental background track for long building instructions featuring a sporty creature battle atmosphere.\n\nStyle: adventure electronic pop.\nMood: energetic, colorful, optimistic and fast-moving.\nUse bright synth leads, light drums, bass pulses and soft cinematic layers.\nAround 118 BPM.\n\nKeep the track family-friendly and stable with consistent energy, suitable for long tutorials and page changes every five seconds.\n\nAvoid hard EDM drops, rock aggression and imitation of existing battle music. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "07 – Rival Encounter\n\nCreate a slightly tense but positive instrumental background track for step-by-step building instructions featuring a friendly rival battle.\n\nStyle: cinematic electronic chill-action.\nMood: determined, exciting, competitive and clean.\nUse pulsing synths, soft low bass, rhythmic percussion and subtle pads.\nAround 109 BPM.\n\nMaintain a steady action pulse while staying controlled and unobtrusive in the background.\n\nAvoid villain-style darkness, extreme intensity and recognizable game or anime themes. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "08 – Energy Burst\n\nCreate a dynamic but polished instrumental background track for long building instructions featuring a fantasy creature action set.\n\nStyle: melodic electro-action chill.\nMood: active, adventurous, bright and motivating.\nUse rhythmic synth plucks, clean electronic drums, smooth bass and airy effects.\nAround 115 BPM.\n\nKeep the track exciting but not overwhelming, with a predictable structure and moderate intensity across the full arrangement.\n\nAvoid heavy drops, distortion and imitation of existing soundtrack melodies. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "09 – Battle Path\n\nCreate a steady action-oriented instrumental background track for step-by-step building instructions featuring a creature battle journey.\n\nStyle: cinematic electronic groove.\nMood: adventurous, focused, optimistic and energetic.\nUse repeating synth pulses, warm bass, subtle percussion and atmospheric pads.\nAround 111 BPM.\n\nKeep the rhythm strong enough to suggest action, but smooth enough for long-form instructional content.\n\nAvoid aggressive club music, intense orchestral drama and recognizable franchise material. Instrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "10 – Final Round Light\n\nCreate a polished upbeat instrumental background track for long building instructions featuring a colorful fantasy creature battle display.\n\nStyle: cinematic chill-action with melodic electronic production.\nMood: lively, exciting, positive, heroic and family-friendly.\nUse bright synth patterns, soft punchy drums, bass pulses and subtle ambient layers.\nAround 117 BPM.\n\nMaintain consistent medium energy and avoid large dramatic moments so the track works as stable background music for long instructions.\n\nAvoid imitation of any existing franchise soundtrack, anime cue or game battle theme. Instrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  }
],
  "icons-ideas__cozy-buildings-interiors": [
  {
    "text": "01 – 11379 Bookstore: Book Nook – Quiet Bookshop\n\nCreate a warm instrumental background track for long step-by-step building instructions featuring a cozy bookstore interior and detailed book nook display.\n\nStyle: acoustic-electronic chill with soft cinematic warmth.\nMood: cozy, intimate, thoughtful, welcoming and calm.\nUse soft piano, fingerpicked acoustic guitar, warm electric piano, gentle pads, subtle percussion and smooth bass.\nAround 88 BPM.\n\nKeep the arrangement steady, repetitive and unobtrusive while instruction pages change every five seconds. Suggest the peaceful atmosphere of browsing books in a small independent bookstore.\n\nAvoid dramatic transitions, strong hooks, busy percussion and recognizable licensed melodies.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "02 – Rainy Café Window\n\nCreate a cozy instrumental background track for step-by-step building instructions featuring a small café, warm interior lighting and a rainy city window.\n\nStyle: lo-fi inspired acoustic chill with clean modern production.\nMood: warm, relaxed, peaceful, comforting and softly urban.\nUse electric piano, muted guitar, soft brushed percussion, subtle bass and light ambient textures.\nAround 84 BPM.\n\nMaintain consistent low-key energy and a simple repeating groove suitable for long instructional videos.\n\nAvoid vinyl crackle that is too prominent, dramatic chord changes, vocals and recognizable melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "03 – Reading Corner\n\nCreate a calm instrumental background track for long building instructions featuring a cozy reading room, shelves, lamps and detailed interior décor.\n\nStyle: ambient acoustic-electronic chill.\nMood: quiet, warm, thoughtful, elegant and comforting.\nUse soft piano, gentle guitar harmonics, warm pads, delicate percussion and smooth bass.\nAround 82 BPM.\n\nKeep the music minimal and slowly evolving, with very consistent volume for instruction pages changing every five seconds.\n\nAvoid strong melodic hooks, cinematic drama and busy rhythmic changes.\n\nInstrumental only. No vocals or spoken words. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "04 – City Apartment Evening\n\nCreate a relaxed instrumental background track for step-by-step building instructions featuring a detailed urban apartment interior.\n\nStyle: modern chill house with acoustic touches.\nMood: comfortable, polished, warm, calm and contemporary.\nUse warm electric piano, subtle synth plucks, soft electronic drums, smooth bass and light guitar.\nAround 96 BPM.\n\nMaintain a steady gentle pulse with consistent energy. The music should feel modern and homely without becoming dance-oriented.\n\nAvoid drops, club energy, dramatic buildups and dominant lead melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "05 – Little Corner Shop\n\nCreate a cheerful but calm instrumental background track for long building instructions featuring a small neighborhood shop or cozy storefront.\n\nStyle: light melodic acoustic-electronic.\nMood: friendly, charming, sunny, welcoming and relaxed.\nUse acoustic guitar, warm piano, soft plucks, gentle bass and subtle percussion.\nAround 94 BPM.\n\nKeep the rhythm simple and predictable, with small melodic variations suitable for long tutorials.\n\nAvoid overly playful cartoon sounds, strong pop hooks and dramatic transitions.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "06 – Warm Interior Details\n\nCreate a soft polished instrumental background track for detailed building instructions focused on furniture, shelves, lamps and decorative interior elements.\n\nStyle: ambient lounge chill.\nMood: tasteful, warm, clean, relaxed and refined.\nUse electric piano, airy pads, soft bass, subtle percussion and sparse guitar accents.\nAround 86 BPM.\n\nKeep the arrangement understated and repetitive so it never distracts from the build.\n\nAvoid dramatic moments, vocals, heavy bass and prominent lead instruments.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "07 – Bookshop After Hours\n\nCreate a quiet atmospheric instrumental background track for long building instructions featuring a bookstore after closing time.\n\nStyle: cinematic chill with acoustic and ambient textures.\nMood: peaceful, intimate, nostalgic, elegant and softly mysterious.\nUse warm piano, fingerpicked guitar, subtle strings, soft pads and minimal percussion.\nAround 80 BPM.\n\nMaintain a slow steady flow with gradual texture changes and consistent dynamics.\n\nAvoid sadness, dramatic scoring, recognizable themes and strong rhythmic accents.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "08 – Sunday Brunch Interior\n\nCreate a light warm instrumental background track for step-by-step building instructions featuring a cozy café or restaurant interior.\n\nStyle: acoustic chill with subtle jazz-lounge touches.\nMood: easygoing, bright, relaxed, friendly and refined.\nUse soft electric piano, muted guitar, gentle brushed percussion, warm bass and subtle melodic plucks.\nAround 92 BPM.\n\nKeep the groove steady and background-friendly with no dramatic musical events.\n\nAvoid swing-heavy jazz, vocals, strong solos and catchy commercial hooks.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "09 – Tiny House Calm\n\nCreate a gentle instrumental background track for long building instructions featuring a compact cozy house with detailed rooms and furnishings.\n\nStyle: acoustic ambient chill.\nMood: peaceful, homely, simple, warm and optimistic.\nUse fingerpicked guitar, soft piano, gentle pads, light percussion and smooth bass.\nAround 84 BPM.\n\nKeep the track repetitive, soft and consistent for long-form instructional use.\n\nAvoid dramatic transitions, sentimental crescendos and prominent lead melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "10 – Cozy Architecture Studio\n\nCreate a clean relaxing instrumental background track for step-by-step building instructions featuring a detailed cozy building or interior display.\n\nStyle: modern ambient chill with acoustic-electronic balance.\nMood: polished, calm, creative, warm and architectural.\nUse soft synth pads, warm piano, light guitar, smooth bass and restrained electronic percussion.\nAround 90 BPM.\n\nMaintain a consistent understated groove with subtle variation while instruction pages change every five seconds.\n\nAvoid club-style rhythms, dramatic soundtrack elements and recognizable melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  }
],
  "icons-ideas__elegant-historic": [
  {
    "text": "01 – 21373 Downton Abbey – Grand Estate\n\nCreate an elegant instrumental background track for long step-by-step building instructions featuring a grand historic country estate and refined period architecture.\n\nStyle: cinematic chamber chill with restrained classical influence.\nMood: dignified, graceful, warm, historic and sophisticated.\nUse soft piano, gentle strings, subtle woodwinds, light chamber percussion and warm ambient pads.\nAround 76 BPM.\n\nKeep the arrangement smooth and understated with consistent dynamics, suitable for long instructional videos.\n\nDo not imitate any existing television score, period-drama soundtrack or recognizable licensed melody. Avoid dramatic orchestral climaxes and strong themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "02 – Heritage Hall\n\nCreate a calm refined instrumental background track for building instructions featuring an elegant historic mansion interior.\n\nStyle: chamber ambient with modern cinematic production.\nMood: stately, polished, peaceful, timeless and warm.\nUse piano, soft strings, subtle harp-like plucks, gentle ambient pads and minimal percussion.\nAround 74 BPM.\n\nMaintain a slow graceful flow with subtle variation and no sudden changes.\n\nAvoid melodrama, sweeping romantic themes, recognizable soundtrack material and heavy percussion.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "03 – Old Library Estate\n\nCreate a sophisticated instrumental background track for long building instructions featuring a historic library, manor or classical interior.\n\nStyle: neoclassical chill with soft ambient textures.\nMood: intellectual, elegant, calm, historic and intimate.\nUse felt piano, soft strings, subtle cello, light ambient pads and restrained percussion.\nAround 72 BPM.\n\nKeep the music minimal and consistent, with gentle harmonic movement suitable for a long tutorial.\n\nAvoid emotional crescendos, virtuoso classical passages and recognizable melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "04 – Stone Manor Morning\n\nCreate a warm atmospheric instrumental background track for step-by-step building instructions featuring a historic stone manor or stately home.\n\nStyle: cinematic acoustic ambient.\nMood: dignified, peaceful, refined, bright and timeless.\nUse soft piano, acoustic guitar, gentle strings, subtle woodwinds and light percussion.\nAround 78 BPM.\n\nMaintain steady low-intensity energy and gradual variation throughout.\n\nAvoid epic orchestration, dramatic tension and recognizable licensed music.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "05 – Classical Façade\n\nCreate an elegant background track for detailed building instructions featuring classical architecture and ornate historic façades.\n\nStyle: minimal neoclassical ambient.\nMood: balanced, graceful, architectural, calm and sophisticated.\nUse piano, restrained strings, soft plucked textures, warm pads and sparse percussion.\nAround 70 BPM.\n\nKeep the structure clean and repetitive so the music supports precise visual instructions without distraction.\n\nAvoid dramatic symphonic writing, strong leitmotifs and heavy low end.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "06 – Historic Drawing Room\n\nCreate a calm refined instrumental background track for long building instructions featuring an elegant drawing room with period furniture and decorative details.\n\nStyle: chamber lounge ambient.\nMood: intimate, polished, warm, graceful and quiet.\nUse soft piano, muted strings, subtle harp, gentle bass and very light brushed percussion.\nAround 76 BPM.\n\nKeep a steady background-friendly flow with small variations and consistent dynamics.\n\nAvoid waltz clichés, dramatic romance, vocals and recognizable soundtrack themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "07 – Estate Gardens at Dusk\n\nCreate a soft cinematic instrumental background track for long building instructions featuring a historic estate and formal gardens.\n\nStyle: atmospheric chamber chill.\nMood: serene, elegant, nostalgic, spacious and refined.\nUse soft strings, piano, gentle woodwinds, airy pads and minimal percussion.\nAround 74 BPM.\n\nMaintain gradual evolution and a calm consistent intensity.\n\nAvoid sentimental melodrama, sweeping orchestral climaxes and recognizable film or television melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "08 – Heritage Architecture\n\nCreate a polished instrumental background track for step-by-step building instructions featuring historic architecture, columns, stonework and classic design.\n\nStyle: cinematic ambient with subtle classical elements.\nMood: prestigious, thoughtful, calm, timeless and precise.\nUse warm piano, restrained strings, soft ambient pads, gentle low bass and sparse percussion.\nAround 78 BPM.\n\nKeep the music understated and steady for long instructional use.\n\nAvoid epic grandeur, ceremonial fanfares and recognizable motifs.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "09 – Evening at the Manor\n\nCreate a warm elegant instrumental background track for long building instructions featuring a historic manor illuminated in the evening.\n\nStyle: neoclassical cinematic chill.\nMood: cozy, dignified, peaceful, nostalgic and sophisticated.\nUse felt piano, soft strings, subtle cello, warm pads and gentle percussion.\nAround 72 BPM.\n\nMaintain smooth consistent dynamics with a restrained original melodic idea.\n\nAvoid melodramatic swells, sadness and imitation of existing period-drama music.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "10 – Timeless Residence\n\nCreate a refined instrumental background track for detailed building instructions featuring a prestigious historic residence or landmark.\n\nStyle: premium cinematic chamber ambient.\nMood: timeless, elegant, calm, architectural and quietly impressive.\nUse piano, soft strings, subtle woodwinds, low warm pads and minimal percussion.\nAround 75 BPM.\n\nKeep the arrangement steady, restrained and suitable for very long tutorials.\n\nAvoid recognizable soundtrack themes, dramatic crescendos, strong percussion and dominant melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  }
],
  "icons-ideas__playful-quirky": [
  {
    "text": "01 – 21371 Wallace & Gromit – Inventor’s Workshop\n\nCreate a playful instrumental background track for long step-by-step building instructions featuring an eccentric inventor’s workshop and quirky animated characters.\n\nStyle: light whimsical acoustic-electronic with gentle cinematic touches.\nMood: cheerful, clever, quirky, friendly and inventive.\nUse pizzicato strings, soft clarinet-like tones, muted guitar, light percussion, warm bass and subtle synth accents.\nAround 102 BPM.\n\nKeep the humor subtle and the rhythm steady so the music remains suitable as background for instruction pages changing every five seconds.\n\nDo not imitate any existing film or television score, character theme or recognizable melody. Avoid slapstick sound effects and overly busy orchestration.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "02 – Quirky Contraption\n\nCreate a cheerful instrumental background track for building instructions featuring a humorous mechanical invention or unusual display model.\n\nStyle: playful chamber-electronic chill.\nMood: inventive, curious, lighthearted, clever and relaxed.\nUse pizzicato strings, marimba-like plucks, warm bass, light electronic drums and subtle woodwind textures.\nAround 104 BPM.\n\nMaintain consistent energy and a simple repeating groove. Keep the quirky character gentle rather than comedic or chaotic.\n\nAvoid cartoon sound effects, dramatic changes and recognizable licensed themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "03 – Stop-Motion Workshop\n\nCreate a warm playful instrumental background track for long building instructions featuring handcrafted animated characters and a detailed workshop setting.\n\nStyle: acoustic whimsical chill.\nMood: charming, tactile, cozy, inventive and family-friendly.\nUse acoustic guitar, soft piano, light pizzicato strings, subtle percussion and gentle bass.\nAround 96 BPM.\n\nKeep the arrangement steady and unobtrusive with small playful variations.\n\nAvoid imitation of any existing stop-motion soundtrack, strong comedic cues and catchy licensed-style melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "04 – Odd Little Machine\n\nCreate a light quirky instrumental background track for step-by-step building instructions featuring a strange but charming mechanical model.\n\nStyle: minimalist playful electronic-acoustic.\nMood: curious, clever, whimsical, upbeat and calm.\nUse soft plucked synths, muted guitar, small percussion, warm bass and occasional bell-like accents.\nAround 100 BPM.\n\nKeep the groove repetitive and clean so it works well through long instruction sequences.\n\nAvoid novelty sound effects, dramatic drops, chaotic rhythms and recognizable media themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "05 – Cheerful Character Shelf\n\nCreate a bright but gentle instrumental background track for long building instructions featuring colorful pop-culture character display models.\n\nStyle: melodic chill pop with whimsical acoustic details.\nMood: playful, friendly, polished, cheerful and relaxed.\nUse piano, soft synth plucks, light guitar, gentle bass and subtle electronic drums.\nAround 106 BPM.\n\nMaintain steady medium-light energy with simple original melodic ideas.\n\nAvoid imitation of existing character songs, soundtrack themes, vocals and heavy pop production.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "06 – Eccentric Living Room\n\nCreate a playful cozy instrumental background track for step-by-step building instructions featuring an unusual character-filled interior.\n\nStyle: quirky lounge chill.\nMood: warm, humorous, charming, relaxed and slightly eccentric.\nUse electric piano, muted guitar, subtle pizzicato strings, smooth bass and light percussion.\nAround 94 BPM.\n\nKeep the music background-friendly and consistent, with gentle quirks rather than obvious comedy.\n\nAvoid slapstick cues, dramatic scene changes and recognizable licensed melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "07 – Handmade Adventure\n\nCreate a cheerful instrumental background track for long building instructions featuring a handcrafted, imaginative and playful display model.\n\nStyle: acoustic-electronic adventure chill.\nMood: creative, charming, optimistic, curious and family-friendly.\nUse acoustic guitar, piano, light strings, soft synth plucks and gentle percussion.\nAround 101 BPM.\n\nMaintain a smooth repeating flow with small variations and consistent dynamics.\n\nAvoid heroic scoring, loud comedy effects and imitation of existing franchise music.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "08 – Tea, Tools & Trouble\n\nCreate a light playful instrumental background track for long step-by-step building instructions featuring eccentric characters, gadgets and domestic comedy.\n\nStyle: whimsical chamber chill with subtle electronic support.\nMood: clever, cozy, quirky, playful and relaxed.\nUse pizzicato strings, gentle piano, soft woodwind-like tones, warm bass and restrained percussion.\nAround 98 BPM.\n\nKeep the humor understated and the structure predictable for long-form instructional use.\n\nAvoid direct references to any existing comedy soundtrack, slapstick effects and recognizable melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "09 – Curious Display Piece\n\nCreate a polished playful instrumental background track for building instructions featuring an unusual or humorous collector display model.\n\nStyle: modern whimsical chill.\nMood: clean, curious, playful, tasteful and light.\nUse soft synth plucks, piano, muted guitar, subtle percussion and smooth bass.\nAround 100 BPM.\n\nMaintain consistent low-to-medium energy and avoid large musical changes.\n\nAvoid novelty music, strong hooks and recognizable pop-culture themes.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  },
  {
    "text": "10 – Quirky Collector Evening\n\nCreate a relaxed instrumental background track for long building instructions featuring a charming eccentric pop-culture display set.\n\nStyle: cinematic chill with whimsical acoustic accents.\nMood: cozy, playful, polished, nostalgic and gently humorous.\nUse warm piano, soft strings, muted guitar, subtle bells and light percussion.\nAround 92 BPM.\n\nKeep the track calm and repetitive with gentle variation, suitable for very long tutorials.\n\nAvoid imitation of existing film or television scores, dramatic storytelling and dominant lead melodies.\n\nInstrumental only. Original composition only.",
    "generated": false,
    "approved": false
  }
]
};
const SEED_KEY="ytMusicLibrary.seed.catalog.v6";
const subDescriptions={
 "star-wars__imperial-dark-space":"Star Destroyery, Executor, Death Star, Imperial ships",
 "star-wars__jedi-force-mystical":"Jedi Temple, Yoda, Luke, Force-related sety, lightsaber display",
 "star-wars__space-battle-action":"X-wing, TIE Fighter, Millennium Falcon, stíhačky a bojové scény",
 "star-wars__rebel-adventure":"Rebel Alliance, Resistance, dobrodružné lodě a základny",
 "star-wars__mandalorian-bounty-hunters":"Mandalorian, Boba Fett, bounty hunters, Razor Crest",
 "star-wars__droids-light-playful":"R2-D2, C-3PO, BB-8, drobné a hravé sety",
 "star-wars__display-collectors":"Helmy, lightsabery, loga, dioramata, UCS display modely",
 "icons-ideas__retro-nostalgia":"Staré přístroje, retro předměty a nostalgické licence. Hudba: warm retro chill, jemný analogový charakter, nostalgie bez kopírování známých skladeb.",
 "icons-ideas__vehicles-engineering":"Auta, vlaky a technicky zaměřené modely. Hudba: moderní, přesná, lehce rytmická, electronic / melodic chill.",
 "icons-ideas__nature-decorative":"Příroda, dekorace a estetické display modely. Hudba: organická, klidná, ambientní, jemně akustická.",
 "icons-ideas__cinematic-pop-culture":"Filmy, seriály a výrazné licence. Hudba: cinematic chill podle konkrétního setu, vždy bez napodobování existujícího soundtracku.",
 "icons-ideas__medieval-castle-fantasy":"Hrady, středověk a fantasy modely. Hudba: jemná cinematic / folk ambient atmosféra se středověkými prvky, vhodná pro dlouhé návody."
};
const KEY="ytMusicLibrary.v2",OLD="ytMusicLibrary.v1";
let data=load();
function load(){try{let x=localStorage.getItem(KEY)||localStorage.getItem(OLD);let d=x?JSON.parse(x):{},prompts=d.prompts||{};if(localStorage.getItem(SEED_KEY)!=="1"){for(const [k,items] of Object.entries(seededPrompts)){let arr=prompts[k]??=[];let seen=new Set(arr.map(x=>x.text));for(const item of items)if(!seen.has(item.text))arr.push({...item});prompts[k]=arr}localStorage.setItem(SEED_KEY,"1");localStorage.setItem(KEY,JSON.stringify({prompts,audio:d.audio||{}}))}return {prompts,audio:d.audio||{}}}catch(e){let prompts={};for(const [k,items] of Object.entries(seededPrompts))prompts[k]=items.map(x=>({...x}));localStorage.setItem(SEED_KEY,"1");return {prompts,audio:{}}}}
const slug=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const key=(t,s)=>slug(t)+"__"+slug(s), esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cityFoodTitles=["City_Pizza_Delivery","Calm_Pizza_Build","City_Food_Truck","Calm_Burger_Build","Sunny_Street_Food","Cozy_City_Cafe","Happy_Food_Truck","Easy_Delivery","Donut_Truck","Penguin_Slushy_Van","Fries_Food_Truck","Ice_Cream_Van","Soft_Donut_Cafe","Cool_Slushy_Day","Easy_Street_Food","Summer_Ice_Cream"];
const filePart=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/&/g," and ").replace(/[^A-Za-z0-9]+/g,"_").replace(/^_+|_+$/g,"");
function suggestedTitle(t,s,p,i){
  if(t==="City"&&s==="Food"&&cityFoodTitles[i])return cityFoodTitles[i];
  let first=String(p?.text||"").trim().split(/\n/)[0].trim();
  first=first.replace(/^\d{1,2}\s*[–—-]\s*/,"").trim();
  let parts=first.split(/\s+[–—]\s+/).filter(Boolean);
  if(parts.length>1)first=parts[parts.length-1];
  first=first.replace(/^\d{5}\s+/,"").trim();
  let clean=filePart(first);
  return clean||("Track_"+String(i+1).padStart(2,"0"));
}
function promptFilename(t,s,p,i){return filePart(t)+"_"+filePart(s)+"_"+String(i+1).padStart(2,"0")+"-"+suggestedTitle(t,s,p,i)}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function toast(s){let e=document.getElementById("toast");e.textContent=s;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1400)}
function keysFor(t,s){return s?[key(t,s)]:catalog.find(x=>x.name===t).subs.map(x=>key(t,x))}
function stats(t,s){let ks=t?keysFor(t,s):Object.keys(data.prompts),ps=ks.flatMap(k=>data.prompts[k]||[]),aud=(t?ks:Object.keys(data.audio)).flatMap(k=>data.audio[k]||[]);return{p:ps.length,g:ps.filter(x=>x.generated).length,a:ps.filter(x=>x.approved).length,y:aud.length}}
function statline(x){return `${x.p} prompts · ${x.g} generated · ${x.a} approved · ${x.y} library`}
function summary(){let s=stats();document.getElementById("summary").innerHTML=`<div class="summary"><div class="metric"><strong>${s.p}</strong><span>AI prompts</span></div><div class="metric"><strong>${s.g}</strong><span>Generated tracks</span></div><div class="metric"><strong>${s.a}</strong><span>Approved tracks</span></div><div class="metric"><strong>${s.y}</strong><span>YouTube Library tracks</span></div></div>`}
function home(q=""){let qq=q.toLowerCase();let themeNav=`<div class="navchips">${catalog.map(t=>`<a class="chip" href="#theme/${slug(t.name)}">${t.name}</a>`).join("")}</div>`;let cards=catalog.filter(t=>!qq||t.name.toLowerCase().includes(qq)||t.subs.some(s=>s.toLowerCase().includes(qq))).map(t=>{let st=stats(t.name);let subs=t.subs.filter(s=>!qq||t.name.toLowerCase().includes(qq)||s.toLowerCase().includes(qq));return `<div class="card"><div class="theme-head"><div><h2><a class="theme-link" href="#theme/${slug(t.name)}">${t.name}</a></h2><div class="progress"><i style="width:${st.p?Math.round(st.a/st.p*100):0}%"></i></div></div><span class="stats">${statline(st)}</span></div><div class="subtree">${subs.map(s=>`<div class="subrow"><a class="theme-link" href="#theme/${slug(t.name)}/${slug(s)}">${s}</a><span class="stats">${statline(stats(t.name,s))}</span></div>`).join("")}</div></div>`}).join("");return `<div class="crumb">LEGO</div>${themeNav}<div class="searchrow"><input class="search" id="search" value="${esc(q)}" placeholder="Search theme or subtheme…"></div>`+(cards||'<div class="empty">Nothing found.</div>')}
function themePage(t){return `<div class="crumb"><a href="#">LEGO</a> / ${t.name}</div><div class="section-head"><h1>${t.name}</h1><span class="stats">${statline(stats(t.name))}</span></div><div class="navchips">${t.subs.map(s=>`<a class="chip" href="#theme/${slug(t.name)}/${slug(s)}">${s}</a>`).join("")}</div>`+t.subs.map(s=>section(t.name,s)).join("")}
function section(t,s){let k=key(t,s),ps=data.prompts[k]||[],aud=data.audio[k]||[],st=stats(t,s);return `<section class="card section" id="${slug(s)}"><div class="section-head"><div class="sub-title"><h2>${s}</h2>${subDescriptions[k]?`<span class="sub-desc">${esc(subDescriptions[k])}</span>`:""}</div><span class="pill">${statline(st)}</span></div><h3>AI music prompts</h3>${ps.length?ps.map((p,i)=>`<div class="prompt"><div class="num">${i+1}.</div><div class="prompt-main"><div class="file-name-row"><span class="file-name">${esc(promptFilename(t,s,p,i))}</span><button class="copy-name" onclick="copyName(${JSON.stringify(t)},${JSON.stringify(s)},'${k}',${i})">Copy name</button></div><div class="prompt-text collapsed" id="pt-${k}-${i}">${esc(p.text)}</div><button class="expand-btn" id="pe-${k}-${i}" onclick="togglePromptView('${k}',${i})">Rozbalit</button></div><button onclick="copyPrompt('${k}',${i})">Copy</button><label class="status"><input type="checkbox" ${p.generated?"checked":""} onchange="toggle('${k}',${i},'generated',this.checked)">Generated</label><label class="status"><input type="checkbox" ${p.approved?"checked":""} onchange="toggle('${k}',${i},'approved',this.checked)">Approved</label><button class="danger delete" onclick="delPrompt('${k}',${i})">×</button></div>`).join(""):'<div class="empty">No prompts yet.</div>'}<div class="addbar"><textarea id="new-${k}" rows="2" placeholder="Paste one prompt, or several prompts separated by blank lines…"></textarea><button class="primary" onclick="addPrompt('${k}')">Add prompt(s)</button></div><h3>YouTube Audio Library</h3>${aud.length?`<table class="audio-table"><tr><th>Track</th><th>Artist / note</th><th></th></tr>${aud.map((a,i)=>`<tr><td>${esc(a.title)}</td><td>${esc(a.note)}</td><td><button class="danger" onclick="delAudio('${k}',${i})">×</button></td></tr>`).join("")}</table>`:'<div class="empty">No downloaded tracks recorded yet.</div>'}<div class="addbar"><input id="at-${k}" placeholder="Track name"><input id="an-${k}" placeholder="Artist / note"><button onclick="addAudio('${k}')">Add track</button></div></section>`}
function render(){summary();let parts=location.hash.slice(1).split("/");if(parts[0]==="theme"){let t=catalog.find(x=>slug(x.name)===parts[1]);app.innerHTML=t?themePage(t):home();if(parts[2])setTimeout(()=>document.getElementById(parts[2])?.scrollIntoView(),0)}else app.innerHTML=home();let se=document.getElementById("search");if(se)se.oninput=e=>app.innerHTML=home(e.target.value)}
window.togglePromptView=(k,i)=>{let p=document.getElementById("pt-"+k+"-"+i),b=document.getElementById("pe-"+k+"-"+i);if(!p||!b)return;let open=p.classList.toggle("expanded");p.classList.toggle("collapsed",!open);b.textContent=open?"Sbalit":"Rozbalit"};
window.copyName=(t,s,k,i)=>navigator.clipboard.writeText(promptFilename(t,s,data.prompts[k][i],i)).then(()=>toast("Name copied"));
window.copyPrompt=(k,i)=>navigator.clipboard.writeText(data.prompts[k][i].text).then(()=>toast("Prompt copied"));
window.toggle=(k,i,f,v)=>{data.prompts[k][i][f]=v;if(f==="approved"&&v)data.prompts[k][i].generated=true;save();render()};
window.addPrompt=k=>{let e=document.getElementById("new-"+k),items=e.value.trim().split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);if(!items.length)return;(data.prompts[k]??=[]).push(...items.map(text=>({text,generated:false,approved:false})));save();render();toast(items.length+" prompt(s) added")};
window.delPrompt=(k,i)=>{if(confirm("Delete this prompt?")){data.prompts[k].splice(i,1);save();render()}};
window.addAudio=k=>{let t=document.getElementById("at-"+k),n=document.getElementById("an-"+k);if(!t.value.trim())return;(data.audio[k]??=[]).push({title:t.value.trim(),note:n.value.trim()});save();render();toast("Track added")};
window.delAudio=(k,i)=>{data.audio[k].splice(i,1);save();render()};
function download(){let payload={app:"YouTube Music Library",version:2,exportedAt:new Date().toISOString(),data};let b=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="youtube-music-library-backup.json";a.click();URL.revokeObjectURL(a.href)}
exportBtn.onclick=download;importBtn.onclick=()=>importFile.click();importFile.onchange=async e=>{try{let j=JSON.parse(await e.target.files[0].text()),d=j.data||j;if(!d.prompts||!d.audio)throw 0;if(confirm("Import will replace current browser data. Continue?")){data={prompts:d.prompts,audio:d.audio};save();render();toast("Backup imported")}}catch(x){alert("Invalid backup file.")}e.target.value=""};
addEventListener("hashchange",render);render();