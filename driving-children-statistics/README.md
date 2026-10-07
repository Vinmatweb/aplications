# Driving children – statistics

Mobile-first family tracker for school and kindergarten trips, pickups, clubs and weekend activities.

## Preset week

- Monday: no club by default; it can be enabled for Maty, Vincent or both
- Tuesday: Atletika
- Wednesday: Plavání
- Thursday: Judo; Maty does not attend kindergarten by default, but can be added for an individual date
- Friday: Olaf OCR for Vincent
- Saturday and Sunday: free-form morning and afternoon activity with Táta/Máma assignment

Every weekday club can be enabled or disabled for a specific date. Both parents can be selected for any task. Statistics can be filtered by week, month, year or all saved records and include separate totals for school/kindergarten trips and all weekday transport including clubs.

All entries are saved automatically to the current browser's `localStorage`. No family records are committed to GitHub or sent to a server.

Open `index.html` through a static web server. No build step or dependencies are required.

Run checks with:

```sh
npm test
node --check app.js
node --check model.js
```
