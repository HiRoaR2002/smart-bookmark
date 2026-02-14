# Quick Start Guide

Get your Smart Bookmark App running in minutes!

## 🚀 Fast Track Setup

### 1. Install Dependencies (1 minute)

```bash
cd smart-bookmark-app
npm install
```

### 2. Set Up Supabase (5 minutes)

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → "Start your project"
2. Create a new organization (if needed)
3. Click "New Project"
4. Name: `smart-bookmarks` (or your choice)
5. Database Password: (create a strong password)
6. Region: Choose closest to you
7. Click "Create new project" (takes ~2 minutes)

#### Run SQL Setup
1. In Supabase Dashboard, click "SQL Editor" (left sidebar)
2. Click "New query"
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click "Run" (bottom right)
5. You should see "Success. No rows returned"

#### Enable Realtime
1. Go to "Database" → "Replication" (left sidebar)
2. Find the `bookmarks` table
3. Toggle it ON
4. Click "0 tables selected" to close

#### Get Your API Keys
1. Go to "Settings" → "API" (left sidebar)
2. Copy the **Project URL** (looks like: `https://xxx.supabase.co`)
3. Copy the **anon public** key (long string)

### 3. Configure Google OAuth (10 minutes)

#### Create Google OAuth Client
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select one
3. Left menu → "APIs & Services" → "Credentials"
4. If first time: Configure consent screen
   - User Type: External
   - App name: Smart Bookmark App
   - User support email: your email
   - Developer contact: your email
   - Save and continue (leave scopes blank)
   - Add test users: your email
   - Save
5. Back to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
6. Application type: Web application
7. Name: Smart Bookmark App
8. Authorized redirect URIs:
   - Add: `http://localhost:3000/auth/callback`
   - Add: `https://<your-project-id>.supabase.co/auth/v1/callback`
9. Click "Create"
10. **Copy Client ID and Client Secret**

#### Configure in Supabase
1. Supabase Dashboard → "Authentication" → "Providers"
2. Find "Google" in the list
3. Toggle it ON
4. Paste your Google Client ID
5. Paste your Google Client Secret
6. Click "Save"

### 4. Set Environment Variables (1 minute)

Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and replace:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 5. Run the App (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Test It Out! 🎉

1. Click "Sign in with Google"
2. Authorize the app
3. Add your first bookmark
4. Open another tab to see real-time sync!

## ⏱️ Total Time: ~20 minutes

## 🆘 Troubleshooting

### "Invalid login credentials"
- Make sure you added the correct redirect URI in Google Console
- Check that Google provider is enabled in Supabase

### Can't see bookmarks
- Run the SQL setup again
- Check browser console for errors
- Verify RLS policies are created

### "Failed to fetch"
- Double-check your `.env.local` values
- Make sure Supabase project is active

## 📚 Need More Details?

Check out the full [README.md](README.md) for comprehensive documentation.

## 🚀 Ready to Deploy?

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel deployment instructions.
