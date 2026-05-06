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

The data is stored in `data/resume.json`.
Default reset source is `public/data/resume.default.json`.
