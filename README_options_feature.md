# Dropdown Feature Patch

## New Pages
- `/new-ticket` — Create tickets with Category, Company, and Department dropdowns
- `/admin/options` — Manage dropdown options (add/remove)

## New APIs
- `/api/options/[type]` — Manage categories, companies, departments
- `/api/tickets/createWithMeta` — Create ticket storing dropdown fields

## Setup
1. Copy these files into your `helpdesk_full` project.
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_ADMIN_PASSWORD=changeme
   ```
3. Run `npm install` and `npm run dev`.

