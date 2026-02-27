# Two sites: Portfolio + Dsync

- **Portfolio** = this repo (root) → one Netlify site, one link.
- **Dsync** = your existing app in **`dsync/`** or **`dsync-website/`** (created by another agent) → second Netlify site, second link.

---

## 1. Portfolio (this repo, root)

- **Run locally:** `npm run dev` → http://localhost:5173
- **Deploy:** Connect this repo to Netlify.
  - **Base directory:** *(leave empty)*
  - **Build command:** `npm run build`
  - **Publish directory:** `dist`
- **URL:** e.g. **yashdorshetwar.netlify.app**

---

## 2. Dsync (your existing app — deploy this one)

You already have Dsync ready in either **`dsync/`** or **`dsync-website/`**. Use **one** of the options below.

### Option A — Same repo, two Netlify sites

1. In **Netlify**: **Add new site** → **Import an existing project** → choose **this same GitHub repo**.
2. **Site name:** e.g. `dsync` → URL like **dsync.netlify.app**.
3. **Build settings:**
   - **Base directory:** `dsync` **or** `dsync-website` (whichever folder has your Dsync app).
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Deploy.** Netlify will run `npm run build` inside that folder and publish `dist/`.

### Option B — Dsync in its own repo (recommended for two separate repos)

1. Create a **new GitHub repo** (e.g. `dsync` or `dsync-website`).
2. Copy **all contents** of **`dsync/`** or **`dsync-website/`** into the root of the new repo (so the new repo has `package.json`, `src/`, `netlify.toml` at the root).
3. Push to the new repo.
4. In **Netlify**: **Add new site** → **Import from GitHub** → select that Dsync repo.
   - Build command: `npm run build`
   - Publish directory: `dist`
   - *(No base directory — build runs at repo root.)*
5. Deploy. You get a second URL (e.g. **dsync.netlify.app**).

### Run Dsync locally

```bash
cd dsync
# or: cd dsync-website
npm install
npm run dev
```

Then open the URL Vite prints (e.g. http://localhost:5173).

---

## Summary

| Site       | Folder / repo        | Netlify base directory | URL (example)           |
|------------|----------------------|-------------------------|--------------------------|
| Portfolio  | This repo (root)     | *(empty)*               | yashdorshetwar.netlify.app |
| Dsync      | `dsync/` or `dsync-website/` (or its own repo) | `dsync` or `dsync-website` if same repo; empty if own repo | dsync.netlify.app       |

The **dsync-app** folder that was added earlier has been **removed**. Deploy the Dsync site you already have in **`dsync/`** or **`dsync-website/`**.
