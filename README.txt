# Confession Room

A mobile-first anonymous confession page + private organizer dashboard.

## Files

- `index.html` — public confession page
- `admin.html` — organizer dashboard
- `style.css` — nightclub/neon styling
- `app.js` — public submission logic
- `admin.js` — Supabase login/moderation logic
- `supabase.sql` — database table + security policies

## Free setup

1. Create a free Supabase project.
2. Open SQL Editor and run everything in `supabase.sql`.
3. In Supabase Authentication, create the organizer's email/password user.
4. Copy the Supabase Project URL and anon/public key.
5. Paste them into BOTH `app.js` and `admin.js` where it says `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY`.
6. Upload this folder to a free static host such as Vercel or GitHub Pages.
7. Put the public URL into a QR code and display it at the event.
8. Open `/admin.html` privately on the organizer's phone/laptop.

## Important anonymity note

The public page does not ask for a name, email or phone number and the database only stores the confession text, approval state and timestamp. Do not claim that submissions are literally "untraceable" unless your complete hosting/analytics/logging setup also avoids identifying metadata. Avoid adding analytics, third-party trackers, or IP logging if anonymity is a core promise.

## Event safety

Moderate submissions before showing them on a club screen. Do not automatically publish every confession.
