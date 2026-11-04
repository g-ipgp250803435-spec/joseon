# Deploy JOSEON Premium V6 to Vercel

1. Download and extract `JOSEON_PREMIUM_V6_VERCEL_GITHUB_COMPLETE.zip`.
2. Create a new GitHub repository. Upload all extracted files and folders into the repository root. Do not upload only the `.zip` and do not include `.test-build`, `node_modules`, or previous releases.
3. In Vercel, select **New Project**, import your GitHub repo, and choose the **Vite** framework.
4. Confirm project root is `./` (repo root), install command `npm install`, build command `npm run build`, and output directory `dist`. These are declared in `vercel.json`.
5. No environment variables, database or paid APIs are required.
6. Deploy; confirm that Vercel reports a successful TypeScript + Vite build. Run the included checks locally or inspect GitHub Actions on the `main` branch.
7. After deployment, create a campaign, resolve its opening event, explore the House Council and Estate Ledger, advance a month, save a slot, reload, export/import JSON and switch English/Korean. Repeat at mobile width. LocalStorage is **browser- and origin-specific**: changing the site URL may prevent older saves from appearing, so use JSON export to move campaigns.

## Commands

```bash
npm install
npm run test
npm run build
npm run preview
```

Vercel's `dist` output is built during deployment. The source ZIP does not contain a precompiled build, and the preparation environment could not install dependencies from npm to perform a full Vite production build. Treat the deploy as verified only after Vercel's build succeeds.

## Troubleshooting

- **Missing modules / dependency errors:** ensure `package.json` is in the repo root; run `npm install` with Node 22.
- **Blank page:** check browser console and that deployment framework is Vite and output directory `dist`.
- **Old save missing:** check the website origin. Use exported JSON rather than assuming LocalStorage syncs across domains/devices.
- **Damaged save:** game validation rejects invalid save data; use an earlier manual slot or valid JSON backup.
- **Broken visuals:** check `public/art`, its portrait SVGs and that Vercel copied `public` into the build.
- **Historical accuracy:** story material is dramatized and fictional elements are labeled as such.
