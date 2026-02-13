# Publish your portfolio online

Your project is ready to deploy. Here are the simplest options.

---

## Option 1: Netlify (recommended – already configured)

1. **Push your code to GitHub** (if you haven’t already):
   - Create a repo at [github.com/new](https://github.com/new)
   - In your project folder run:
   ```bash
   git init
   git add .
   git commit -m "Portfolio ready"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com) and sign in (GitHub is fine).
   - Click **Add new site** → **Import an existing project**.
   - Choose **GitHub** and select your repo.
   - Netlify will use your existing `netlify.toml`:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Click **Deploy site**.

3. **Your site will be live** at a URL like `https://random-name-123.netlify.app`.  
   You can change it in **Site settings** → **Domain management** (e.g. `yash-dorshetwar.netlify.app` or your own domain).

---

## Option 2: Vercel

1. Push your code to GitHub (same as above).

2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import your repo.

3. Use these settings:
   - **Framework Preset:** Vite  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`  
   - **Install Command:** `npm install`

4. Click **Deploy**. You’ll get a URL like `https://your-project.vercel.app`.

---

## Before you deploy

- **Environment variables:** If you add Firebase, Stripe, or other secrets later, set them in your host’s dashboard (Netlify: **Site settings** → **Environment variables**; Vercel: **Project** → **Settings** → **Environment Variables**).
- **Resume:** `public/resume.pdf` is included in the build; the Resume button will work after deploy.
- **Custom domain:** Both Netlify and Vercel let you add your own domain (e.g. `yashdorshetwar.com`) in the site/domain settings.
