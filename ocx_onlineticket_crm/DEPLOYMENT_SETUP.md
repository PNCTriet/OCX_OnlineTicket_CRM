# Deployment Setup Guide

## Environment Variables Required

Add these environment variables to your Vercel project:

### Resend API Configuration
```
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM=Ớt Cay Xè <noreply@otcayxe.com>
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the variables above
5. Redeploy your project

## Getting Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy the key and add it to Vercel environment variables

## Domain Verification

Make sure your sender email domain is verified in Resend dashboard before sending emails. 