# www.nuroburst.com — Coming soon

Static marketing placeholder for the public site.

## Local preview

Open `index.html` in a browser, or:

```bash
npx --yes serve .
```

## Logo

Place your official logo at `logo.png` in this folder (transparent PNG recommended).  
If the file is missing, a CSS wordmark is shown automatically.

## Deploy on Render

1. Push this folder to a GitHub repo (e.g. `nuroburst-www`).
2. Render → **New** → **Static Site**
3. Connect the repo
4. Settings:
   - **Build command:** leave empty (or `echo "static"`)
   - **Publish directory:** `.` (repo root)
5. Add custom domains: `nuroburst.com` and `www.nuroburst.com`
6. In your DNS provider:
   - Follow Render’s CNAME/A records for the static site
   - Prefer apex + www both pointing at this service (or redirect apex → www)

## Stack

Plain HTML/CSS. No framework, no build step, no secrets.
