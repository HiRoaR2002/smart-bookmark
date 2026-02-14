# Smart Bookmark App

A simple and elegant bookmark manager built with Next.js, Supabase, and Tailwind CSS. Users can sign in with Google OAuth and manage their personal bookmarks with real-time synchronization.

## Features

✅ **Google OAuth Authentication** - Sign in securely using your Google account (no email/password required)  
✅ **Add Bookmarks** - Save URLs with custom titles  
✅ **Private Bookmarks** - Each user can only see their own bookmarks  
✅ **Real-time Updates** - Bookmarks sync instantly across multiple tabs/devices  
✅ **Delete Bookmarks** - Remove unwanted bookmarks with one click  
✅ **Simple & Clean UI** - Built with Tailwind CSS for a modern, responsive design

## Tech Stack

- **Next.js 16** (App Router)
- **Supabase** (Authentication, Database, Real-time)
- **Tailwind CSS** (Styling)
- **TypeScript**

## Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- A Supabase account ([sign up for free](https://supabase.com))
- A Google Cloud Platform account for OAuth credentials

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd smart-bookmark-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details and create the project

#### Create the Bookmarks Table

Run this SQL in the Supabase SQL Editor:

```sql
-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create policy: Users can only see their own bookmarks
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

-- Create policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

-- Create policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);
```

#### Enable Real-time

1. Go to Database → Replication in your Supabase dashboard
2. Enable replication for the `bookmarks` table

### 4. Configure Google OAuth

#### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the consent screen if prompted
6. For Application type, select "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://your-domain.vercel.app/auth/callback` (for production)
8. Save and copy your Client ID and Client Secret

#### Configure Supabase Auth

1. In Supabase Dashboard, go to Authentication → Providers
2. Enable Google provider
3. Enter your Google Client ID and Client Secret
4. Save the configuration

### 5. Environment Variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in:
- Supabase Dashboard → Settings → API

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### 3. Update Google OAuth Redirect URIs

After deployment, add your Vercel URL to Google Cloud Console:
- `https://your-app.vercel.app/auth/callback`

### 4. Update Supabase Site URL

In Supabase Dashboard → Authentication → URL Configuration:
- Set Site URL to your Vercel deployment URL
- Add your Vercel URL to Redirect URLs

## Project Structure

```
smart-bookmark-app/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts          # OAuth callback handler
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Main dashboard
│   │   └── globals.css               # Global styles
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts             # Supabase client (browser)
│   │       ├── server.ts             # Supabase server client
│   │       └── middleware.ts         # Session management
│   └── middleware.ts                 # Next.js middleware
├── .env.local                        # Environment variables
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
└── package.json
```

## How It Works

### Authentication Flow

1. User clicks "Sign in with Google" on the login page
2. Redirected to Google OAuth consent screen
3. After authorization, Google redirects to `/auth/callback`
4. Session is created and user is redirected to the main dashboard

### Real-time Updates

The app uses Supabase Real-time to sync bookmarks:
- When a bookmark is added/deleted, all open tabs receive the update instantly
- This works across multiple devices for the same user

### Row Level Security (RLS)

Supabase RLS ensures data privacy:
- Users can only see, add, and delete their own bookmarks
- Database-level security prevents unauthorized access

## Troubleshooting

### "Invalid login credentials" error

- Make sure Google OAuth is properly configured in Supabase
- Verify redirect URIs match in both Google Console and Supabase

### Bookmarks not showing

- Check browser console for errors
- Verify RLS policies are correctly set up in Supabase
- Ensure the user is properly authenticated

### Real-time not working

- Confirm Replication is enabled for the `bookmarks` table
- Check that the channel subscription is working (console logs)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
