# Sunil Muneshwar — Personal Portfolio Website

A modern, responsive personal portfolio website built for **Sunil Muneshwar**, IT Infrastructure Professional (16 years of experience in Windows Server, VMware virtualization, Azure Cloud, networking, SAP Basis, and digital marketing).

## Design Palette

All styling follows the core CSS custom properties defined in `src/index.css`:

- `--primary: #101c30` (Primary navy)
- `--secondary: #172942` (Secondary navy slate)
- `--orange: #f47721` (Vibrant orange accent)
- `--white: #ffffff` (Primary light surface)
- `--light: #f5f7fa` (Alternating light section background)
- `--text: #64748b` (Body & muted text ink)

## Editing Content

### In the Browser
- **Portrait Photo**: Click **Upload Photo** on the hero portrait frame to replace the placeholder with your real photo.
- **Technical Skills**: Click the edit icon on any skill card to add/edit technologies and optionally supply verified proficiency percentages.
- **Professional Experience**: Click **Edit Role** or **Add Experience** to enter your actual employers, employment periods, responsibilities, and achievements.
- **Projects**: Click **Edit** or **Add Project** to replace sample templates with your completed projects and verified URLs.
- **Certifications**: Click **Add Credential** / **Manage** on any track to upload certificate images and add verification links.
- **Contact Details**: Click the edit icon in the Contact Details panel to update your email, phone, LinkedIn, GitHub, and WhatsApp links.
- **Backup / Export**: Open **Portfolio Editor & Export** in the About section to export or import your customized JSON.

### In Visual Studio Code
- Default portfolio data: `src/data/defaultPortfolio.ts`
- Global palette & animations: `src/index.css`
- Downloadable resume PDF: `public/assets/documents/resume.pdf` (replace with your updated PDF file keeping the same filename)
- Backend contact endpoint: `server.ts` (`POST /api/contact`)

## Supabase Database Setup (Contact Form)

The contact form saves submissions directly to the `contacts` table in Supabase via `src/lib/supabase.ts` (with a server fallback on `POST /api/contact` when running with Express):

1. Open your Supabase Dashboard -> **SQL Editor** and run the script in `supabase/schema.sql` to create the `public.contacts` table with an insert-only Row Level Security policy.
2. Add these environment variables in AI Studio **Settings -> Secrets**, Netlify **Site configuration -> Environment variables**, or your local `.env` (see `.env.example`):
   - `VITE_SUPABASE_URL=https://dwxehuzgekdmkvqmmtok.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>`

## Deploying to Netlify

This project includes a ready-to-use `netlify.toml` (`npm run build` -> `dist`, Node 22, SPA redirects, and security headers).

### Option 1: Deploy via GitHub (Recommended)
1. Push this project to a GitHub repository (or export from AI Studio to GitHub).
2. Sign in to [Netlify](https://app.netlify.com/) -> **Add new site** -> **Import an existing project** -> choose your repository.
3. Netlify automatically reads `netlify.toml` (`Build command: npm run build`, `Publish directory: dist`).
4. Under **Site configuration -> Environment variables**, add:
   - `VITE_SUPABASE_URL` = `https://dwxehuzgekdmkvqmmtok.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase publishable key
5. Click **Deploy site** (or **Trigger deploy -> Clear cache and deploy site** after adding environment variables so Vite embeds them in the build).

### Option 2: Netlify CLI / Manual Drag-and-Drop
1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in your local `.env` file.
2. Run `npm install && npm run build`.
3. Drag and drop the generated `dist` folder into Netlify Drop, or run `npx netlify deploy --prod --dir=dist`.

## Running Locally

```bash
npm install
npm run dev
```

For production builds:

```bash
npm run build
npm start
```
