# Deploying JOSEON Premium Edition on Vercel

## Step 1 — Extract and commit the complete project

Download and extract the release ZIP. Create a GitHub repository, for example `joseon-the-crown-and-the-legacy`, and upload the extracted **file contents** into the repository root. The root must include `package.json`, `index.html`, `vercel.json`, `vite.config.ts`, `src/`, and `public/`. Do not upload only the ZIP, and do not put the project inside an extra nested folder unless you configure that as Vercel's Root Directory.

## Step 2 — Import in Vercel

Visit [Vercel New Project](https://vercel.com/new), select your GitHub repository, and use these settings:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `./` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js | 20.x or 22.x |
| Environment variables | None required |

Click Deploy. Vercel downloads the dependencies, runs TypeScript checking and Vite, then serves `dist/` as a static site. No backend is required.

## Step 3 — Validate the public link

After Vercel reports **Ready**, open the live URL in a desktop browser and a mobile browser. Confirm: Main Menu → Historical Campaign → 1724 → Character Creation → Prologue Choice → Activities → Court Factions → Save → Refresh → Resume; then test manual save loading, story choices, language toggle, relationship conversation and map travel. Export a JSON backup before replacing an older deployment. Verify browser console has no errors.

## Step 4 — Future updates

Commit future code changes to the main branch. Vercel rebuilds automatically. `.github/workflows/quality.yml` also runs domain tests and a Vite build in GitHub Actions. Once you can run `npm install` locally, commit the generated `package-lock.json` for reproducible installs and optionally switch the workflow to `npm ci`.

## Saving and domains

LocalStorage is tied to the **exact hostname**. Progress saved on one `*.vercel.app` preview URL will not automatically appear on a different hostname or custom domain. Export your campaign JSON file, then import it on the new domain. Browser data deletion and private/incognito browsing can remove saves. There is no cloud account or sync feature.

## Troubleshooting

- **`Failed to resolve import`**: verify all project files were uploaded and allow the dependency install to finish.
- **`Cannot find module vite/react`**: the install step did not complete; check npm registry access.
- **Blank screen**: inspect DevTools Console and Vercel deployment logs; make sure the output directory is `dist`, not the repository root.
- **Can't find previous save**: compare hostnames; export/import campaign JSON.
- **No ambience**: it is off by default and must be started by clicking the speaker control. Some browser contexts restrict Web Audio.

The project contains a single client-side screen app with no application routes, so no wildcard rewrite is needed for the current release.
