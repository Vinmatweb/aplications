# VinMatův svět: Nápady a priority

Jednoduchá tabule pro oddělení aktuálních priorit od nápadů, které počkají na později.

## Funkce

- Přidávání, přejmenování a mazání priorit i nápadů.
- Změna pořadí přetažením nebo pomocí šipek.
- Přesun nápadu mezi priority; nová priorita dostane střední důležitost.
- Důležitost priority lze nastavit na vysokou, střední nebo nízkou.
- Hlasové zadávání v češtině, pokud ho prohlížeč podporuje.
- Načítání a ukládání seznamu přímo do jedné Google tabulky po přihlášení.
- Pravidelné načítání změn z jiných chatů a zařízení.
- Sloučení nezávislých úprav podle interních ID a upozornění na souběžné konflikty.
- Záloha či obnovení přes JSON.
- Tři přepínatelné vzhledy: graffiti, původní a mezivarianta; každý lze přepnout mezi denním a nočním režimem.

Google Sheet je společný zdroj dat aplikace. Web nepoužívá localStorage pro úkoly ani nápady; místně ukládá pouze vzhled, režim a informaci, že konkrétní tabulka byla vybrána v Google Pickeru.

Aplikace žádá pouze rozsah OAuth `drive.file`. Google Picker je omezený na soubor ID `1QvOa1dYkQKgU7Ejf482OGdSHib7C0KW6J6KIBDv5GTs`, takže lze připojit jen tuto tabulku. Přístup k jejímu obsahu i zápisu se řídí oprávněním přihlášeného účtu v Google Drive.

## Nastavení přístupu Google

V souboru `config.js` doplň Google Picker API key. OAuth Client ID a číslo projektu jsou už připravené. Client ID ani API key nejsou tajné klíče; API key ale omez podle níže uvedených pravidel.

1. V Google Cloud zapni **Google Sheets API** a **Google Picker API**.
2. Na obrazovce souhlasu OAuth ponech rozsah `drive.file` a odeber široký rozsah `spreadsheets`, pokud tam zůstává. Aplikace žádá pouze `drive.file`.
3. V **APIs & Services → Credentials** vytvoř API key.
4. Omez API key:
   - **Application restrictions → Websites**: přidej `https://vinmat.eu/*` a `https://docs.google.com/*`. Pokud používáš místní testovací server, přidej i jeho adresu.
   - **API restrictions**: povol pouze **Google Picker API**.
5. Vlož klíč do hodnoty `googlePickerApiKey` v tomto souboru. Projekt je `336778193875`.
6. Přihlášený Google účet musí mít oprávnění upravovat tabulku:
   https://docs.google.com/spreadsheets/d/1QvOa1dYkQKgU7Ejf482OGdSHib7C0KW6J6KIBDv5GTs/edit

Při prvním připojení aplikace Google Picker nabídne pouze tuto tabulku. Po jejím výběru aplikace načte a ukládá změny přímo v ní. Přístupový token zůstává pouze v paměti otevřené stránky a po obnovení stránky je potřeba Google znovu připojit.

Pokud jsi aplikaci dříve povolil s rozsahem `spreadsheets`, po zveřejnění této verze odeber její staré oprávnění v nastavení Google účtu v části **Zabezpečení → Připojení aplikace třetích stran**. Potom aplikaci znovu připoj. Tím zrušíš dřívější široké oprávnění; nová verze si vyžádá jen `drive.file`.

## Spuštění

Otevři index.html přes webový server. Google OAuth nefunguje při otevření souboru jako `file://`. Pro místní testování použij například `http://localhost:8000` a přidej tento origin do nastavení OAuth klienta i mezi povolené webové adresy API key.
