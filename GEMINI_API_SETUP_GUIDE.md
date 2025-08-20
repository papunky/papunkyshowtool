# Google Gemini API Setup Guide for Radio Show Tool

This guide will help you set up Google Gemini API access for your radio show management tool. Gemini is often more cost-effective and easier to set up than other AI APIs.

## Why Google Gemini 2.0 Flash?

✅ **Latest AI Model**: Most advanced Gemini model with improved reasoning  
✅ **More Cost-Effective**: Often 10-20x cheaper than other APIs  
✅ **Easy Setup**: Simple API key generation process  
✅ **Superior Performance**: Faster and more accurate than previous versions  
✅ **Enhanced Research**: Better at finding and citing reliable sources  
✅ **No Separate Billing**: Uses your existing Google account  

## Step 1: Get Your Gemini API Key

### 1.1 Go to Google AI Studio
1. Open your web browser and navigate to: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account (any Gmail account works)

### 1.2 Create API Key
1. Click **"Create API key"**
2. Select **"Create API key in new project"** (or choose an existing project if you have one)
3. Your API key will be generated immediately
4. **Copy the API key** - it will look something like: `AIzaSyD4vX9Z8Y7W6V5U4T3S2R1Q0P9O8N7M6L5K`

### 1.3 Secure Your API Key
⚠️ **Important**: Never share this API key publicly or commit it to code repositories.

## Step 2: Add API Key to Vercel

### 2.1 Access Your Vercel Dashboard
1. Go to **https://vercel.com** and sign in
2. Navigate to your radio show project
3. Click on your project to enter the project dashboard

### 2.2 Add Environment Variable
1. Click on the **"Settings"** tab
2. In the left sidebar, click **"Environment Variables"**
3. Click **"Add New"**
4. **Name**: Enter exactly `VITE_GEMINI_API_KEY`
5. **Value**: Paste your Gemini API key
6. **Environment**: Select **"Production"** (and optionally "Preview" and "Development")
7. Click **"Save"**

### 2.3 Trigger Redeploy
1. Go to the **"Deployments"** tab
2. Click the **three dots (⋯)** next to your latest deployment
3. Select **"Redeploy"**
4. Wait for deployment to complete (usually 1-3 minutes)

## Step 3: Test Your Setup

### 3.1 Upload a Test CSV
1. Go to your live Vercel URL
2. Create a simple CSV file with this content:
   ```csv
   artist,title
   The Beatles,Hey Jude
   Miles Davis,So What
   ```
3. Upload the CSV file

### 3.2 Verify Research Works
You should see:
- ✅ Progress bar showing "Researching tracks..."
- ✅ "Successfully researched X tracks" message
- ✅ Tracks with detailed information, talking points, and sources
- ✅ No "API key not configured" messages

## Pricing (Very Affordable!)

### Gemini 2.0 Flash Pricing:
- **Input**: $0.075 per million tokens
- **Output**: $0.30 per million tokens

### Cost Per Track Research:
- **Input**: ~500 tokens = $0.0000375
- **Output**: ~300 tokens = $0.00009
- **Total per track**: ~$0.00013 (about 0.01 cents!)

### Real Examples:
- **10 tracks**: ~$0.001 (less than a penny!)
- **50 tracks**: ~$0.007 (less than a penny!)
- **100 tracks**: ~$0.013 (about 1 cent!)
- **Monthly usage (400 tracks)**: ~$0.05 (5 cents!)

This is significantly cheaper than most other AI APIs!

## Troubleshooting

### Issue: "API key not configured"
**Solutions:**
1. Check environment variable name: Must be exactly `VITE_GEMINI_API_KEY`
2. Verify you triggered a redeploy after adding the environment variable
3. Check that your API key is valid at https://aistudio.google.com/app/apikey

### Issue: API quota exceeded
**Solutions:**
1. Gemini has generous free quotas, but check your usage at https://aistudio.google.com/app/apikey
2. The tool includes 1-second delays between requests to respect rate limits
3. Try uploading smaller CSV files (10-20 tracks at a time)

### Issue: Research not working
**Solutions:**
1. Check browser console (F12) for error messages
2. Verify your CSV format has "artist" and "title" columns
3. Ensure stable internet connection during research

### Issue: Invalid JSON responses
**Solutions:**
1. This is rare with Gemini, but the tool includes fallback handling
2. Failed tracks will be added with basic info and marked for manual research
3. You can retry by uploading the CSV again

## CSV Format Requirements

Your CSV file should have columns for artist and track title:

**Supported column names:**
- `artist`, `Artist`, `Track Artist` - for artist names
- `title`, `Title`, `Track Name`, `name` - for song titles

**Example CSV:**
```csv
artist,title,album,year
The Beatles,Hey Jude,The Beatles 1967-1970,1968
Miles Davis,So What,Kind of Blue,1959
Fela Kuti,Zombie,Zombie,1976
```

## What You'll Get

For each track, the tool will research and provide:

### 📊 **Basic Info**
- Release year
- Genre and subgenre
- Region/country of origin

### 📚 **Rich Context**
- Cultural background and historical context
- Interesting musical and production details
- Global connections and cross-cultural influences

### 🎙️ **Radio-Ready Content**
- 2-3 concise talking points (under 25 words each)
- Source citations for credibility
- Links to reliable music databases

### Example Output:
```
Song: "So What" by Miles Davis
Year: 1959 | Genre: Jazz | Region: United States

Cultural Context: Revolutionary modal jazz composition that broke from traditional chord progressions, recorded during the iconic Kind of Blue sessions.

Talking Points:
• "So What" uses only two chords over 32 bars, revolutionizing jazz composition in 1959 [1]
• Recorded in just one take during the legendary Kind of Blue sessions at Columbia Studios [1,2]
• The song's modal approach influenced rock bands like The Grateful Dead and Pink Floyd [2]

Sources:
[1] AllMusic - Kind of Blue Album Review
[2] Rolling Stone - 500 Greatest Songs of All Time
```

## Security Best Practices

1. **Never share your API key** in emails, code, or public repositories
2. **Use environment variables only** - never hardcode keys
3. **Monitor usage** at https://aistudio.google.com/app/apikey
4. **Rotate keys** periodically for security

## Getting Help

**Google AI Issues:**
- Google AI Studio: https://aistudio.google.com/
- Documentation: https://ai.google.dev/

**Vercel Issues:**
- Vercel Support: https://vercel.com/help

**Radio Tool Issues:**
- Check browser console (F12) for detailed error messages
- Verify CSV format matches requirements
- Ensure environment variable is set correctly

---

## Quick Setup Checklist

- [ ] Created Gemini API key at https://aistudio.google.com/app/apikey
- [ ] Added `VITE_GEMINI_API_KEY` environment variable in Vercel
- [ ] Triggered Vercel redeploy
- [ ] Tested with sample CSV upload
- [ ] Verified research functionality works

Your radio show tool should now automatically research tracks with comprehensive information, engaging talking points, and reliable sources - all for just pennies per show! 🎵📻