# Srovnání obou aplikací

Porovnání dodané HTML aplikace ve složce `pdf2etsy-claude` s původní aplikací `pdf2etsy`. Úpravy se publikují na původní adrese https://vinmat.eu/aplications/pdf2etsy/.

| Oblast | Výhoda dodané HTML verze | Výsledek v původní aplikaci |
| --- | --- | --- |
| Složky zvířat | Katalog podsložek a předvyplnění podle zvířete | Převzato. Vybraná podsložka připraví nový balíček s kontrolou přiřazení. Rozpracovaná práce se zachová. |
| Soukromý Google Drive | Přihlášení přes vlastní OAuth klient a přímé čtení API | Převzato pro veřejný i serverový web. Pouze čtení, token jen v paměti, přehled složek, hromadný import i jednotlivé soubory. |
| Schránka | Ctrl+V do zvolené buňky | Převzato. Běžné vložení textu do polí zůstává funkční. |
| Přesouvání souborů | Přetažení náhledu do jiné buňky | Převzato. Přesun na obsazenou buňku oba zdroje prohodí; kontroluje se i zastaralé přetažení nebo jiný projekt. |
| Hromadné vložení | Přetažení složky, více souborů pod sebe, další očíslované řádky | Převzato s kontrolou před vložením. Vnořené složky se procházejí celé; konfliktní přiřazení se musí vyřešit před importem. |
| Obsah PDF | Obrázkové náhledy a vlastní pozadí | Převzato jako volba vedle textového seznamu. Šablonou může být obrázek nebo první stránka PDF. Počet stran obsahu i následná čísla se dopočítají podle rozložení. |
| Více exportů | Jedna akce pro všechny varianty | Převzato a rozšířeno na pět dostupných variant: oba typy ČB, oba typy s barevnými vzory, kompletní. Výsledky mají jednotlivé odkazy ke stažení. |

## Zachované přednosti původní verze

- Celé vícestránkové PDF v jedné buňce: zachovají se všechny stránky, výřez, rotace a vektorová grafika. Dodaná HTML varianta pracuje se zvolenou jednotlivou stránkou a při exportu může PDF rasterizovat.
- Přenosná záloha `.paperwork` včetně podkladů; více samostatných projektů a oddělené české / anglické názvy pro obsah.
- Větší písmo, přehlednější stav uložení, kontrola exportu a stálý odkaz ke stažení PDF.
- Limity souborů, počtu stran a celkových podkladů; nevkládání prázdných listů a společné informační karty bez duplicit.
- Chybějící obtahovačka se automaticky nenahrazuje běžnou omalovánkou. Export na chybějící podklady upozorní a vynechá je.

## Ověření

Kontrola TypeScriptu, produkční sestavení, původní kontrola pěti pořadí exportů a nové kontroly katalogu složek, přiřazení názvů, rozšíření na 100 listů, výměny zdrojů a obrázkového obsahu. Drive API je ověřené simulovanými odpověďmi včetně podsložek, stránkování, stažení, limitů a vypršení připojení; skutečný účet vyžaduje uživatelské OAuth nastavení.

PDF ověření používá skutečný generátor: A4 / US Letter, textový a obrázkový obsah, vícestránkové PDF, vektorové pozadí obsahu a dlouhý export s pěti stránkami obrázkového obsahu. Náhledy PDF byly vizuálně zkontrolované. V prohlížeči je ověřené vytvoření pěti exportů, vložení obrázku ze schránky a prohození obsazených buněk.

Výběr celé složky přes dialog cloudového testovacího prohlížeče nevrátil soubory, proto tato konkrétní interakce není ověřená koncovým testem. Rozdělení skutečných názvů a cest do katalogu i postupné čtení složek ověřují automatické testy.
