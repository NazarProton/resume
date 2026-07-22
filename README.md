# Resume (Next.js)

## Run

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```

## Routes

- `/` - Resume page
- `/admin` - Admin editor (protected with Basic Auth)
- `/api/resume` - GET/PUT JSON data endpoint (also protected)

## Admin credentials (env)

Create `.env`:

```env
ADMIN_USER=admin
ADMIN_PASS=PUT_YOUR_PASSWORD_HERE
```

## Persistent resume data

The code keeps only a default seed in `public/data/resume.default.json`.
Live edits from `/admin` are stored separately, so they are not overwritten by a redeploy.

### Serverless / Vercel

Create an Upstash Redis / Vercel KV database and set:

```env
RESUME_KV_REST_API_URL=https://...
RESUME_KV_REST_API_TOKEN=...
RESUME_KV_KEY=resume:content
```

The app also recognizes Vercel KV names:

```env
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

### Local / VPS file storage

Set `RESUME_DATA_FILE` to a path outside the deployed git checkout:

```env
RESUME_DATA_FILE=/var/lib/resume/resume.json
```

If no persistent storage env vars are set, the app falls back to `data/resume.json` for local compatibility.
