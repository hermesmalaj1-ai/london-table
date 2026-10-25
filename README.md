# London Table

An original, mobile-friendly dinner planner for someone living in London. Inspired by publicly described meal-planning features of mise; no proprietary code, branding or assets copied or extracted.

## Included
- Seven-day dinner plans for 1–4 people, omnivore / vegetarian / vegan, and maximum cooking time.
- Original small recipe collection, meal swaps, metric ingredient quantities and approximate kcal per serving.
- Weekly budget tracking in GBP, pantry-aware shopping lists, shopping checkboxes and text download.
- Local browser persistence and a remembered UK supermarket preference.
- No backend, paid dependencies, API key or login required.

## Important scope
This is a working first version with 10 original recipes and a rules-based planner. It does not call an AI service. Budget is compared against estimated ingredient usage; it is not a guaranteed spending cap. Pantry selection means the whole required quantity is already available. Nutrition and costs are illustrative, not verified dietary guidance or current retailer quotes. Supermarket selection labels your list; it does not change prices or connect to a basket. Only dinners are planned. There is no allergy filtering, calorie targeting, account sync or live supermarket integration. Data stays in the current browser and may be lost when browser data is cleared. Check food labels and cooking instructions.

## Run locally
Requires Node.js 20+ and Python 3 for the optional preview server.

```sh
npm test
npm run build
npm run dev
```

Visit http://localhost:3000. There are no dependencies to install. Internet is optional for Google Fonts; system fonts work as a fallback.

## GitHub and Vercel
1. Create an empty GitHub repository named `london-table` (private is suitable for personal use).
2. Upload this folder's contents to its root, or initialise and push using Git:

```sh
git init -b main
git add .
git commit -m "Build London Table meal planner"
git remote add origin https://github.com/YOUR_USERNAME/london-table.git
git push -u origin main
```

3. In Vercel choose **Add New → Project**, import that GitHub repository and deploy. `vercel.json` sets the build command to `npm run build` and output to `dist`, with no framework preset. No environment variables are needed.
4. Future pushes to the production branch trigger deployments through Vercel's Git integration.

Deployment reference: https://vercel.com/docs/git

## Files
`public/engine.js`: recipes, planning and aggregation. `public/app.js`: interactions and local storage. `public/style.css`: responsive layout. `build.mjs`: copies public assets into `dist`. `tests/engine.test.js`: planning and shopping-list checks.

## Verification
Planner and shopping aggregation have automated Node tests; build and JavaScript syntax are checked. Browser interactions and a live Vercel deployment have not been verified in this environment.
