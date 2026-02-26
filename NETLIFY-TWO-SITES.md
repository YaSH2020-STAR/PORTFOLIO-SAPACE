# Publish both: Portfolio + Dsync (separate sites)

You have **two different apps** in this repo. Publish them as **two separate Netlify sites** so yashdorshetwar and Dsync stay different.

---

## 1. Portfolio → yashdorshetwar.netlify.app

1. Go to **[app.netlify.com](https://app.netlify.com)** → **Add new site** → **Import an existing project**.
2. Connect **GitHub** and select this repo (**version19**).
3. **Site name:** `yashdorshetwar` (so the URL is **yashdorshetwar.netlify.app**).
4. **Build settings** (must be exactly this for portfolio):
   - **Base directory:** leave **empty** (blank).
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**.  
   → This site = **your portfolio only** (root of the repo).

---

## 2. Dsync → dsync.netlify.app

1. Again: **Add new site** → **Import an existing project**.
2. Connect **GitHub** and select the **same repo** (version19).
3. **Site name:** `dsync` (so the URL is **dsync.netlify.app**).
4. **Build settings** (must be exactly this for Dsync):
   - **Base directory:** `dsync`  ← **must not be empty**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**.  
   → This site = **Dsync only** (built from the `dsync/` folder).

---

## Summary

| What        | Site name   | Base directory | URL                        |
|------------|-------------|----------------|----------------------------|
| Portfolio  | yashdorshetwar | *(leave empty)* | yashdorshetwar.netlify.app |
| Dsync      | dsync       | `dsync`        | dsync.netlify.app          |

- **Two sites**, same repo.  
- Portfolio = root (base directory empty).  
- Dsync = `dsync` folder (base directory = `dsync`).  
- After both deploys, you’ll have both URLs live and different.
