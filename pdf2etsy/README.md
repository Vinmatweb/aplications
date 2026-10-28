# PDF2Etsy — Paperwork PDF Studio

Česká webová aplikace pro sestavování PDF balíčků z vlastních obrázků a PDF.

Veřejná aplikace: https://vinmat.eu/aplications/pdf2etsy/


## Použití

- International Days Animals: titulka, obsah, 5 úrovní, 12 volitelných příběhových listů, 3 informační karty, volitelné bludiště a closing.
- Etsy mega balíček: titulka, obsah, 20 pracovních listů a closing. Další řádky lze přidat po 1–100.
- Každý pracovní list má černobílý zdroj, obtahovačku a barevný vzor. Informační karty a bludiště jsou společné.
- Import PDF, PNG, JPEG a WebP přetažením, výběrem souboru nebo hromadným přiřazením. První stránka PDF má náhled, export zachovává všechny stránky.
- Pojmenování pro automatické přiřazení: irbis_level_1_bw.png, irbis_level_1_trace.pdf, irbis_story_2_color.jpg.
- Obsah se generuje podle fyzického pořadí a skutečných rozsahů stránek. Volitelně textový seznam (až 28 položek) nebo obrázková mřížka (až 12 náhledů). Další strany obsahu se započítají automaticky. Vlastní obrázek / první strana PDF mohou tvořit pozadí; horní a dolní volné místo lze nastavit.
- Export: omalovánky ČB; obtahovačky ČB; kterýkoli typ s barevným vzorem za každým listem; kompletní omalovánka → obtahovačka → vzor. Sdílené karty se nevkládají duplicitně.
- Formát A4 / US Letter, generované stránky EN / CS. Původní grafika se nepřekládá ani automaticky neodbarvuje.
- Volitelný textový branding s vyhrazeným okrajem a číslováním. Vypnout pro hotové obrandované podklady.
- Řádky lze upravovat, přesouvat, duplikovat, vyřadit z exportu a přidávat.
- Označená buňka přijímá obrázek ze schránky přes Ctrl+V. Přetažení náhledu mezi buňkami podklad přesune; obsazené buňky se prohodí. Textová pole zachovávají běžné vložení textu.
- „Složka se zvířaty“ načte katalog podsložek. Zvolená složka předvyplní samostatný nový balíček; současná práce se nepřepisuje. Výběr složek platí pro aktuální otevření aplikace, importované soubory se ukládají do projektu.
- Hromadný import doplní chybějící očíslované řádky. Více souborů vložených do jedné buňky nabídne přiřazení pod sebe. Dvojí přiřazení do stejné buňky blokuje vložení, dokud se konflikt nevyřeší.
- „Vytvořit všechny varianty PDF“ připraví až pět dostupných exportů a nabídne samostatné odkazy ke stažení.
- IndexedDB ukládá projekty a binární zdroje v konkrétním prohlížeči. Záloha .paperwork obsahuje i podklady a obnovuje se jako nový projekt.

## Google Drive

Veřejná i serverová verze umí připojit soukromý Disk přímo přes Google Identity Services a Drive API v3. V dialogu „Z Google Drive“ vlož vlastní OAuth Client ID webové aplikace a odkaz na hlavní složku. V Google Cloud zapni Drive API, povol JavaScript origin `https://vinmat.eu` (pro vývoj příslušný lokální origin), případně přidej účet mezi testovací uživatele. Přihlášení se spouští až tlačítkem Připojit a žádá pouze scope `drive.readonly`. Token zůstává pouze v paměti otevřeného okna; Client ID a ID složky se mohou ukládat lokálně. Připojení se po vypršení obnovuje novým kliknutím. Žádné přihlašovací údaje nejsou ve zdrojích ani zálohách.

Po připojení se zobrazí podsložky zvířat. Lze předvyplnit nový balíček (včetně kontroly přiřazení) nebo načíst jednotlivý soubor do zvoleného řádku. Procházení podporuje podsložky, stránkování i sdílené disky. Limit je 400 podkladů / 180 MB na importovaný balíček a 40 MB na soubor. Produkční tabulka zatím zapojená není.

Bez OAuth použij složku Google Drive pro počítač nebo stažené a rozbalené podklady. Serverová verze navíc zachovává POST `/api/drive` pro konkrétní veřejně sdílený soubor do 25 MB.

Dokumentace Google: [token model](https://developers.google.com/identity/oauth2/web/guides/use-token-model), [files.list](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/list), [stahování souborů](https://developers.google.com/workspace/drive/api/guides/manage-downloads).

Přihlášení ke skutečnému účtu vyžaduje uživatelské OAuth nastavení. Automatické ověření používá simulované odpovědi Google; přístup k osobním souborům nebyl během vývoje vyžádán.

## Limity

40 MB na místní soubor, 180 MB podkladů na projekt, 400 souborů na import, 1 000 řádků, 1 200 stran v jednom exportu. PDF chráněná heslem se odmítají. Zdrojové PDF se do zvoleného formátu vkládají jako vektorové stránky se zachováním poměru stran a rotace. WebP se při importu převádí na PNG.

## Vývoj a ověření

Vinext / React / TypeScript, klientský pdf-lib + fontkit; náhledy PDF přes lokálně dodávaný PDF.js. Závislosti jsou připnuté v pnpm-lock.yaml. Automatické PDF používá vložené DejaVu Sans s českou diakritikou.

- node node_modules/typescript/bin/tsc --noEmit
- node --experimental-strip-types scripts/check-export-order.mjs
- node scripts/check-source-workflows.mjs
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

Aplikace používá Vinext a serverovou cestu pro import veřejného souboru z Disku. Tato složka obsahuje plný zdrojový projekt; Pro GitHub Pages použij níže uvedený příkaz pnpm build:web; serverový import odkazu z Disku vyžaduje serverové hostování. Původní Sites identita je uložená v `.openai/hosting.json`; žádné přístupové tokeny ani uživatelské podklady součástí zdrojů nejsou.


## Publikování na GitHub Pages

Veřejná verze používá stejnou tabulku a klientské generování PDF. Nevyžaduje přihlášení ani server pro místní soubory. Zdroje, náhledy, písma i PDF knihovny načítá relativně ke své složce, takže funguje také v podadresáři webu.

```bash
pnpm build:web
```

Sestavení vytvoří adresář `web/`. Jeho obsah se publikuje do `aplications/pdf2etsy/` v repozitáři `Vinmatweb/vinmatweb.github.io`. Zdrojová verze zůstává v `Vinmatweb/aplications/pdf2etsy`.

Veřejný web nemá serverový proxy, soukromé soubory proto načítá přímo z Drive API po uživatelském OAuth souhlasu. Serverová cesta `/api/drive` pro veřejné odkazy zůstává součástí serverové verze projektu.

Srovnání s dodanou HTML variantou a důvody převzatých funkcí: [COMPARISON.md](COMPARISON.md).
