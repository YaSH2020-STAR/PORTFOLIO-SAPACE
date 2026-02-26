# Deploy Dsync website on Netlify

## Build (already done)

```bash
npm run build
```

Output is in the `dist/` folder.

## Publish on Netlify

### Option A — Drag and drop (quick)

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the **`dist`** folder (or zip it and drag the zip) onto the page
3. Netlify will give you a live URL (e.g. `https://random-name-123.netlify.app`)

### Option B — Connect Git (auto deploy on push)

1. Push this project to GitHub (e.g. a repo named `dsync-website`)
2. Log in at [https://app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Choose **GitHub** and select the repo
4. Netlify will use `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy**. Future pushes to the main branch will auto-deploy.

### Option C — Netlify CLI

```bash
npm install -g netlify-cli   # once
netlify login
cd dsync-website
npm run build
netlify deploy --prod --dir=dist
```

Follow the prompts to create/link a site. You’ll get a URL when it’s done.

---

**Note:** SPA routing is handled by `_redirects` and `netlify.toml` so direct links and refresh work.
