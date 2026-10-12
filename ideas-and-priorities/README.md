# VinMatův svět: Nápady a priority

Jednoduchá tabule pro oddělení aktuálních priorit od nápadů, které počkají na později.

## Funkce

- Přidávání, přejmenování a mazání priorit i nápadů.
- Změna pořadí přetažením nebo pomocí šipek.
- Přesun nápadu mezi priority; nová priorita dostane střední důležitost.
- Důležitost priority lze nastavit na vysokou, střední nebo nízkou.
- Hlasové zadávání v češtině, pokud ho prohlížeč podporuje.
- Načítání a ukládání seznamu přímo do Google Sheets po přihlášení.
- Pravidelné načítání změn z jiných chatů a zařízení.
- Sloučení nezávislých úprav podle interních ID a upozornění na souběžné konflikty.
- Záloha či obnovení přes JSON.
- Tři přepínatelné vzhledy: graffiti, původní a mezivarianta; každý lze přepnout mezi denním a nočním režimem.

Google Sheet je společný zdroj dat aplikace. Web nepoužívá localStorage pro úkoly ani nápady; místně zůstává jen zvolený vzhled a denní/noční režim. Přístup k soukromé tabulce vyžaduje přihlášení Google účtem s oprávněním k úpravám.

## Nastavení přístupu Google

V souboru config.js doplň OAuth Client ID typu Web application. Client ID není tajný klíč a může být ve veřejném repozitáři; nevkládej sem Client Secret ani přístupový token.

1. V Google Cloud vytvoř nebo vyber projekt a zapni Google Sheets API.
2. Nastav obrazovku souhlasu OAuth a přidej účet, který bude aplikaci používat. Pokud je aplikace v testovacím režimu, přidej tento účet mezi testovací uživatele.
3. Vytvoř OAuth Client ID pro Web application.
4. Do Authorized JavaScript origins přidej https://vinmat.eu. Pokud web otevíráš také přes standardní GitHub Pages adresu, přidej https://vinmatweb.github.io; pro místní testování případně přidej http://localhost:8000. Všude se zadává jen origin, bez cesty.
5. Zkopíruj Client ID do hodnoty googleClientId v config.js.

Přihlášený účet musí mít v Google Drive oprávnění upravovat tabulku VinMatův svět – nápady a priority:
https://docs.google.com/spreadsheets/d/1QvOa1dYkQKgU7Ejf482OGdSHib7C0KW6J6KIBDv5GTs/edit

Přístupový token zůstává pouze v paměti otevřené stránky a po obnovení stránky je potřeba Google znovu připojit.

## Spuštění

Otevři index.html přes webový server. Google OAuth nefunguje při otevření souboru jako file://. Pro místní testování použij například http://localhost:8000 a přidej tento origin do nastavení OAuth klienta.
