# London Table

An original, mobile-friendly meal planner for someone living in London. Inspired by publicly described meal-planning features of mise; no proprietary code, branding or assets copied or extracted.

## Included
- Seven-day breakfast, lunch and dinner plans with separate adult and child counts and adjustable child portions, omnivore / vegetarian / vegan, and maximum cooking time.
- Original small recipe collection, meal swaps, metric ingredient quantities and approximate kcal per serving.
- Weekly budget tracking in GBP, pantry-aware shopping lists, shopping checkboxes and text download.
- Local browser persistence and a remembered UK supermarket preference.
- No backend, paid dependencies, API key or login required.

## Important scope
This is a working first version with 26 original recipes and a rules-based planner. It does not call an AI service. Budget is compared against estimated ingredient usage; it is not a guaranteed spending cap. Pantry selection means the whole required quantity is already available. Nutrition and costs are illustrative, not verified dietary guidance or current retailer quotes. Supermarket selection labels your list; it does not change prices or connect to a basket. Choose breakfast, lunch and dinner, or any subset. Weekly budget and shopping totals cover the selected meals. Missing recipe slots are flagged and their costs are excluded from a clearly labelled partial total. Allergy exclusions screen recipe ingredients using the 14 UK regulated allergen groups, including conservative flags for variable compound ingredients. This is not a product-label or cross-contact check and does not guarantee allergen-free meals. All exclusions apply to everyone in the plan and are respected when swapping meals. Child portions are adjustable shopping estimates, not nutritional targets. There is no calorie targeting, account sync or live supermarket integration. Data stays in the current browser and may be lost when browser data is cleared. Check food labels and cooking instructions.

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

## Family and allergy update
Choose adults, children and a portion size per child. Tick household exclusions, then press Plan my week. Existing plans are checked against exclusions on reload. If no recipe matches, exclusions are preserved and an empty-state message appears.

Ingredient quantities and costs scale by adult portions plus selected child portions. Actual appetite varies. This is a dinner-shopping tool, not a child-feeding programme.

Allergen reference: https://www.gov.uk/understanding-food-labelling/allergen-labelling

For the updated site, replace the files inside public/ in GitHub too. A direct Vercel source deployment does not modify the GitHub repository; future pushes can otherwise restore the older version.

## All-day planning update
Breakfast, lunch and dinner are enabled by default. At least one meal must be selected. Each day has one slot per selected meal. Recipe swaps stay in that meal category and keep all diet, time and allergen filters. Existing dinner plans migrate into dinner slots while new breakfast and lunch slots are generated. Shopping quantities aggregate all filled slots. The original £30 budget is preserved, so increase it if you now want it to cover all meals.

## Mixed-diet recipe fix
Everything (includes meat) reserves Monday and Thursday dinner slots and Tuesday lunch for eligible meat recipes. Allergy and time filters always apply first; breakfast-only plans have no forced meat. Other slots retain variety. Meat, fish, vegan and vegetarian labels distinguish recipes. Users can still swap meals. Stored plans regenerate on this release so older all-vegetarian mixed-diet plans do not persist. Added chicken skillet rice, beef rice bowls, turkey pasta and chicken potato bowls, each listed as 25 minutes.
