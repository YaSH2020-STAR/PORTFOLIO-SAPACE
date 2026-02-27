# Deploy Dsync to Netlify — do this once

You have to do this in **your** Netlify account (in the browser). It takes about 2 minutes.

---

## Steps

1. **Open:** [https://app.netlify.com/start](https://app.netlify.com/start)  
   (Or: Netlify dashboard → **Add new site** → **Import an existing project**)

2. **Connect GitHub** and choose the repo that contains this folder (e.g. **PORTFOLIO-SAPACE** / version19).

3. **Configure the build:**
   - **Base directory:** click **Options** / **Configure** and type: **`dsync`**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. Click **Deploy site**.

5. When it finishes, you’ll get a URL like **https://something.netlify.app**.  
   You can rename the site to **dsync** in **Site configuration → General → Site name** so the URL becomes **https://dsync.netlify.app**.

---

## Optional: deploy from terminal (after one-time setup)

If you prefer to deploy from the terminal next time:

```bash
# One-time: install CLI and log in
npm install -g netlify-cli
netlify login

# From repo root, deploy the dsync folder
cd /Users/yashdorshetwar/Desktop/version19/dsync
npm run build
netlify deploy --prod --dir=dist
```

First time you run `netlify deploy`, it will ask you to create or link a site.
