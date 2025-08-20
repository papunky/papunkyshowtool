# Claude API Setup Guide for Radio Show Tool

This comprehensive guide will help you set up Claude API access for your radio show management tool deployed on Vercel. Your tool automatically researches music tracks from CSV uploads, providing cultural context, talking points, and source citations for radio broadcasts.

## Understanding the Setup

Your radio tool currently shows this message when the API key is missing:
- "API key not configured - add VITE_CLAUDE_API_KEY environment variable"
- "Configure API key to enable automatic research"

## Important: Claude Pro vs Claude API

**You need both services for your use case:**
- **Claude Pro**: Your existing subscription for chatting with Claude at claude.ai
- **Claude API**: A separate service for programmatic access (what your radio tool needs)

These are different services with separate billing. Having Claude Pro does NOT automatically give you API access.

## Step 1: Create an Anthropic API Account

### 1.1 Go to Anthropic Console
1. Open your web browser and navigate to: **https://console.anthropic.com**
2. You'll see the Anthropic Console homepage

### 1.2 Sign Up/Sign In
**If you already have a Claude Pro account:**
1. Click **"Sign In"** in the top right corner
2. Use the same email/password from your Claude Pro account
3. You may need to verify your email if it's your first time accessing the console

**If you need to create a new account:**
1. Click **"Sign Up"** 
2. Enter your email address and create a password
3. Verify your email address when prompted
4. Complete any required verification steps

### 1.3 Complete Account Setup
1. You may be asked to provide:
   - Phone number verification
   - Organization details (you can use "Personal" or your radio station name)
   - Use case description (enter "Radio show content research and preparation")

## Step 2: Add Billing and Get API Keys

### 2.1 Navigate to Billing
1. Once logged into the console, look for a **"Billing"** tab in the left sidebar
2. Click on **"Billing"** or **"Add Payment Method"**

### 2.2 Add Payment Method
1. Click **"Add Payment Method"** or **"Set up billing"**
2. Enter your credit card information
3. Confirm your billing address
4. **Important**: Even with a payment method, you'll only be charged for actual API usage

### 2.3 Get Your API Key
1. In the left sidebar, click on **"API Keys"** (may also be labeled as "Keys" or "Authentication")
2. Click **"Create Key"** or **"+ Create new API key"**
3. Give your key a name like "Radio Show Tool" or "KXLU Research"
4. **Copy the API key immediately** - you won't be able to see it again!
5. The key will start with `sk-` and be very long

**⚠️ CRITICAL**: Store this API key securely. You cannot view it again after creation. If you lose it, you'll need to create a new one.

## Step 3: Understanding Pricing for Your Use Case

### 3.1 Current Model and Pricing
Your tool uses **Claude Sonnet 4** model (`claude-sonnet-4-20250514`). Here's the pricing structure:

**Claude Sonnet 4:**
- **Input tokens**: $15.00 per million tokens
- **Output tokens**: $75.00 per million tokens

### 3.2 Cost Calculation for Track Research
Based on your code analysis, each track research involves:
- **Input**: ~1,000 tokens (your research prompt + track info)
- **Output**: ~600-800 tokens (research results, talking points, sources)

**Cost per track:**
- Input: 1,000 tokens = $0.015
- Output: 700 tokens = $0.0525
- **Total per track: ~$0.067 (about 7 cents)**

### 3.3 Real-World Usage Examples
**Small show (10 tracks):** ~$0.67
**Medium show (25 tracks):** ~$1.68
**Large show (50 tracks):** ~$3.35
**Monthly usage (4 shows, 25 tracks each):** ~$6.72

### 3.4 Rate Limits
- Your tool includes a 1-second delay between requests to respect rate limits
- Claude API has generous rate limits for this usage pattern
- You're unlikely to hit limits with typical radio show preparation

## Step 4: Add API Key to Vercel

### 4.1 Access Your Vercel Dashboard
1. Go to **https://vercel.com** and sign in
2. Navigate to your radio show project (should be named something like "papunky-radio-tool")
3. Click on your project to enter the project dashboard

### 4.2 Navigate to Environment Variables
1. In your project dashboard, click on the **"Settings"** tab
2. In the left sidebar, click on **"Environment Variables"**
3. You'll see a section to add new environment variables

### 4.3 Add the Claude API Key
1. Click **"Add New"** or **"+ Add"**
2. **Name**: Enter exactly `VITE_CLAUDE_API_KEY`
3. **Value**: Paste your Claude API key (the long string starting with `sk-`)
4. **Environment**: Select **"Production"** (and optionally "Preview" and "Development" if you want to test)
5. Click **"Save"**

### 4.4 Verify the Environment Variable
You should see your new environment variable listed as:
```
VITE_CLAUDE_API_KEY | sk-ant-api03-... (hidden) | Production
```

## Step 5: Trigger a Vercel Redeploy

### 5.1 Method 1: Force Redeploy from Dashboard
1. In your Vercel project dashboard, go to the **"Deployments"** tab
2. Find your most recent deployment
3. Click the **three dots (⋯)** next to it
4. Select **"Redeploy"**
5. Confirm the redeployment

### 5.2 Method 2: Git Push (if connected to GitHub)
1. Make a small change to any file in your project (like adding a comment)
2. Commit and push to your main branch
3. Vercel will automatically trigger a new deployment

### 5.3 Method 3: Manual Trigger
1. In the **"Settings"** tab, scroll down to **"Git"**
2. Look for **"Deploy Hooks"** 
3. Create a deploy hook and trigger it, or
4. Simply make any change to your project files and push to trigger redeploy

## Step 6: Verify Everything Works

### 6.1 Wait for Deployment
1. Monitor the **"Deployments"** tab until you see "Ready" status
2. This usually takes 1-3 minutes

### 6.2 Test Your Application
1. Go to your live Vercel URL (e.g., `your-project.vercel.app`)
2. Try uploading a CSV file with track information
3. You should see the research progress bar instead of the "API key not configured" message
4. Tracks should now show detailed research, talking points, and sources

### 6.3 Check for Successful Research
Look for:
- ✅ Cultural context information
- ✅ Musical facts and details  
- ✅ Radio-ready talking points
- ✅ Source citations with links
- ✅ Progress bar during research

## Troubleshooting Guide

### Issue: Still seeing "API key not configured"
**Solutions:**
1. **Check environment variable name**: Must be exactly `VITE_CLAUDE_API_KEY` (case-sensitive)
2. **Verify redeploy**: Environment variables only take effect after redeployment
3. **Check API key format**: Should start with `sk-ant-api03-` or similar
4. **Clear browser cache**: Hard refresh your site (Ctrl+F5 or Cmd+Shift+R)

### Issue: API calls failing with errors
**Solutions:**
1. **Billing setup**: Ensure you've added a payment method to Anthropic console
2. **API key permissions**: Create a new API key if the current one has issues
3. **Rate limits**: The tool includes delays, but wait a few minutes if you hit limits
4. **Check console**: Open browser developer tools (F12) to see detailed error messages

### Issue: Research taking too long or timing out
**Solutions:**
1. **File size**: Keep CSV files under 50 tracks for optimal performance
2. **Internet connection**: Ensure stable connection during research
3. **Browser tab**: Keep the tab open during research process
4. **Try smaller batches**: Upload smaller CSV files to test

### Issue: Unexpected charges
**Solutions:**
1. **Monitor usage**: Check the Anthropic console for token usage
2. **Expected costs**: Refer to the pricing calculations above
3. **Set alerts**: Consider setting up billing alerts in the Anthropic console

### Issue: CSV upload problems
**Solutions:**
1. **Column names**: Ensure your CSV has columns named "artist" and "title" (or "Artist" and "Title")
2. **File format**: Use proper CSV format with commas separating values
3. **Text encoding**: Save CSV files as UTF-8 encoding
4. **Example format**:
   ```
   artist,title
   The Beatles,Hey Jude
   Miles Davis,Kind of Blue
   ```

## Sample CSV Format

Your tool expects CSV files with these columns (case-insensitive):
- `artist` or `Artist` or `Track Artist`
- `title` or `Title` or `Track Name` or `name`

**Example CSV:**
```csv
artist,title,album,year
The Beatles,Hey Jude,The Beatles 1967-1970,1968
Miles Davis,So What,Kind of Blue,1959
Fela Kuti,Zombie,Zombie,1976
Ravi Shankar,Raga Jog,Three Ragas,1956
```

## Getting Help

**Anthropic API Issues:**
- Anthropic Support: https://support.anthropic.com
- API Documentation: https://docs.anthropic.com

**Vercel Issues:**
- Vercel Support: https://vercel.com/help
- Documentation: https://vercel.com/docs

**Radio Tool Issues:**
- Check browser console (F12) for error messages
- Ensure CSV format matches requirements
- Verify environment variable is set correctly

## Security Best Practices

1. **Never share your API key** in code, emails, or public repositories
2. **Environment variables only**: Always use Vercel environment variables, never hardcode keys
3. **Monitor usage**: Regular check your Anthropic console for unexpected usage
4. **Rotate keys**: Consider creating new API keys periodically
5. **Access control**: Only share Vercel project access with trusted team members

---

## Summary Checklist

- [ ] Created Anthropic API account at console.anthropic.com
- [ ] Added billing/payment method to Anthropic account
- [ ] Generated API key and copied it securely
- [ ] Added `VITE_CLAUDE_API_KEY` environment variable in Vercel
- [ ] Triggered Vercel redeploy
- [ ] Tested tool with sample CSV upload
- [ ] Verified research functionality works
- [ ] Bookmarked Anthropic console for usage monitoring

Your radio show tool should now automatically research tracks, providing rich cultural context, engaging talking points, and credible sources for your KXLU 88.9 FM broadcasts!