# 🚀 Netlify Deployment Guide - Vaishnavi Birthday Gift

## Step 1: Create Netlify Account
1. Go to: https://app.netlify.com/signup
2. Click "Sign up with GitHub"
3. Authorize Netlify to access your GitHub

## Step 2: Deploy from GitHub
1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select repository: `qr-gift`
4. Click "Deploy site" (no config needed for static site)

## Step 3: Change Site Name
1. After deployment, go to "Site settings"
2. Click "Change site name"
3. Enter: `vaishnavisrivastav-birthday` (or any available name with "vaishnavisrivastav")
4. Save!

## Your New URL:
```
https://vaishnavisrivastav-birthday.netlify.app
```

## Step 4: Generate New QR Codes
Run this command in your project folder:
```bash
python generate_netlify_qr.py
```

## ✅ Done!
- No username visible
- Clean URL with Vaishnavi's name
- Free forever
- Auto-updates when you push to GitHub

## Need Help?
If any step doesn't work, let me know!

