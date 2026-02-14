# Deployment Guide for Smart Bookmark App

This guide will walk you through deploying the Smart Bookmark App to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account ([sign up for free](https://vercel.com))
- Completed the Supabase setup from the main README

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure all your code is committed:

```bash
git init
git add .
git commit -m "Initial commit: Smart Bookmark App"
```

### 2. Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New Repository"
3. Name it (e.g., `smart-bookmark-app`)
4. Don't initialize with README (we already have one)
5. Click "Create Repository"

### 3. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark-app.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: .next (default)

### 5. Add Environment Variables

In the Vercel project settings, add these environment variables:

| Variable Name | Value |
|--------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

You can find these in your Supabase Dashboard → Settings → API

### 6. Deploy

Click "Deploy" and wait for the build to complete.

### 7. Configure OAuth Callbacks

After deployment, you'll get a URL like: `https://your-app.vercel.app`

#### Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client
4. Add to Authorized redirect URIs:
   ```
   https://your-app.vercel.app/auth/callback
   ```
5. Save

#### Update Supabase

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to: `https://your-app.vercel.app`
3. Add to **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/**
   ```
4. Save

### 8. Test Your Deployment

1. Visit your Vercel URL
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Add a bookmark
5. Open in another tab to verify real-time sync

## Custom Domain (Optional)

### Add a Custom Domain

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Update OAuth After Adding Domain

Don't forget to add your custom domain to:
- Google OAuth redirect URIs
- Supabase redirect URLs

## Continuous Deployment

Once set up, Vercel will automatically deploy:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are listed in `package.json`
- Verify environment variables are set correctly

### OAuth Redirect Error

- Double-check redirect URIs match exactly in Google Console
- Ensure Supabase redirect URLs include your domain
- Check that Site URL is set in Supabase

### "Failed to fetch" errors

- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Ensure Supabase project is active

## Monitoring

- **Vercel Analytics**: Enable in project settings for performance insights
- **Supabase Logs**: Check Database → Logs for query errors
- **Browser Console**: Check for client-side errors

## Environment-Specific Configuration

To set different values for preview vs production:

1. Go to Vercel → Settings → Environment Variables
2. Choose environment: Production, Preview, or Development
3. Add environment-specific values

## Security Checklist

✅ Environment variables are not committed to Git  
✅ Supabase RLS policies are enabled  
✅ OAuth redirect URIs are explicitly set  
✅ HTTPS is enforced (automatic with Vercel)  
✅ Supabase anon key is public (this is safe with RLS)

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
