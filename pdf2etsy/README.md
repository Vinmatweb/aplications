# Paperwork — Etsy PDF Studio

Česká webová aplikace pro sestavování PDF balíčků z vlastních obrázků a PDF.

## Použití

- International Days Animals: titulka, obsah, 5 úrovní, 12 volitelných příběhových listů, 3 informační karty, volitelné bludiště a closing.
- Etsy mega balíček: titulka, obsah, 20 pracovních listů a closing. Další řádky lze přidat po 1–100.
- Každý pracovní list má černobílý zdroj, obtahovačku a barevný vzor. Informační karty a bludiště jsou společné.
- Import PDF, PNG, JPEG a WebP přetažením, výběrem souboru nebo hromadným přiřazením. První stránka PDF má náhled, export zachovává všechny stránky.
- Pojmenování pro automatické přiřazení: irbis_level_1_bw.png, irbis_level_1_trace.pdf, irbis_story_2_color.jpg.
- Obsah se generuje podle fyzického pořadí a skutečných rozsahů stránek. Více než 28 položek vytvoří další stranu obsahu.
- Export: omalovánky ČB; obtahovačky ČB; kterýkoli typ s barevným vzorem za každým listem; kompletní omalovánka → obtahovačka → vzor. Sdílené karty se nevkládají duplicitně.
- Formát A4 / US Letter, generované stránky EN / CS. Původní grafika se nepřekládá ani automaticky neodbarvuje.
- Volitelný textový branding s vyhrazeným okrajem a číslováním. Vypnout pro hotové obrandované podklady.
- Řádky lze upravovat, přesouvat, duplikovat, vyřadit z exportu a přidávat.
- IndexedDB ukládá projekty a binární zdroje v konkrétním prohlížeči. Záloha .paperwork obsahuje i podklady a obnovuje se jako nový projekt.

## Google Drive

Serverový POST /api/drive podporuje import konkrétního **veřejně sdíleného** obrázku nebo PDF přes odkaz do 25 MB. Nepoužívá přihlašovací údaje ani soukromý konektor. Povoluje pouze pevně dané domény Google a kontroluje přesměrování, typ a velikost obsahu, časový limit a původ požadavku. Přímé procházení soukromého Disku, produkční tabulka ani synchronizace mezi zařízeními nejsou zapojené. Pro soukromé soubory funguje stažení z Disku a místní hromadný import složky. Eligibility discovery pro připojení Google Drive k Sites nebylo v této relaci dostupné; manifest neobsahuje neověřené deklarace integrace.

## Limity

40 MB na místní soubor, 180 MB podkladů na projekt, 400 souborů na import, 1 000 řádků, 1 200 stran v jednom exportu. PDF chráněná heslem se odmítají. Zdrojové PDF se do zvoleného formátu vkládají jako vektorové stránky se zachováním poměru stran a rotace. WebP se při importu převádí na PNG.

## Vývoj a ověření

Vinext / React / TypeScript, klientský pdf-lib + fontkit; náhledy PDF přes lokálně dodávaný PDF.js. Závislosti jsou připnuté v pnpm-lock.yaml. Automatické PDF používá vložené DejaVu Sans s českou diakritikou.

- node node_modules/typescript/bin/tsc --noEmit
- node --experimental-strip-types scripts/check-export-order.mjs
- npm run build (nebo build helper Sites)
- sites-preview start /absolute/project/path

Skript kontroly pořadí ověřuje všechny exporty, společné karty, vyřazené řádky, vícestránkové podklady, přiřazení názvů a 100 pracovních listů / 313 výsledných stránek.


## GitHub a spuštění

Zdrojový kód: `Vinmatweb/aplications/pdf2etsy`.

Běžící soukromá aplikace: https://etsy-pdf-studio-w4k.jirik66.chatgpt.site

Vyžaduje Node.js 22.13+ a pnpm 11.25.0. Ze složky `pdf2etsy` spusť:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Vývojový server běží standardně na `http://localhost:5173`.

Kontroly a produkční sestavení:

```bash
pnpm exec tsc --noEmit
node --experimental-strip-types scripts/check-export-order.mjs
pnpm build
```

Aplikace používá Vinext a serverovou cestu pro import veřejného souboru z Disku. Tato složka obsahuje plný zdrojový projekt; GitHub Pages samo tento serverový projekt nespustí. Původní Sites identita je uložená v `.openai/hosting.json`; žádné přístupové tokeny ani uživatelské podklady součástí zdrojů nejsou.
