# Driving children – statistics

Mobile-first family tracker for school and kindergarten trips, pickups, clubs and weekend activities.

## Preset week

- Monday: no club
- Tuesday: Atletika
- Wednesday: Plavání
- Thursday: Judo; Maty does not attend kindergarten
- Friday: Olaf OCR
- Saturday and Sunday: free-form morning and afternoon activity with Táta/Máma assignment

All entries are saved automatically to the current browser's `localStorage`. No family records are committed to GitHub or sent to a server.

Open `index.html` through a static web server. No build step or dependencies are required.

Run checks with:

```sh
npm test
node --check app.js
node --check model.js
```
