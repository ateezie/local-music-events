# Spotify API Integration Setup

## Overview

The Local Music Events platform integrates with Spotify to automatically sync artist information, including:
- Artist bio and images
- Popularity scores and follower counts
- Genre information
- Top tracks and albums
- Official Spotify URLs

## Setting Up Spotify API Credentials

### Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in:
   - **App Name**: "Local Music Events"
   - **App Description**: "Artist data synchronization for local music events platform"
   - **Website**: `http://localhost:3000` (for development)
   - **Redirect URI**: Not needed for client credentials flow
5. Accept the terms and create the app

### Step 2: Get Your Credentials

1. In your new app dashboard, note down:
   - **Client ID**: Your public identifier
   - **Client Secret**: Your private key (keep this secure!)
2. Click "Show Client Secret" to reveal the secret

### Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Spotify API Configuration
SPOTIFY_CLIENT_ID="your_actual_client_id_here"
SPOTIFY_CLIENT_SECRET="your_actual_client_secret_here"
```

### Step 4: Restart Development Server

After adding the credentials, restart your development server:

```bash
npm run dev:full
```

## Testing the Integration

1. Navigate to Admin → Artists
2. Click "Edit" on any artist
3. Click the "🎵 Sync with Spotify" button
4. The system will:
   - Search for the artist on Spotify
   - Download bio, images, and metadata
   - Update the artist profile automatically

## Features

### Automatic Data Sync
- **Artist Images**: Downloads high-quality artist photos
- **Biography**: Generates bio from Spotify genres and follower count
- **Genres**: Maps Spotify genres to platform categories
- **Social Links**: Updates Spotify URL automatically

### Smart Matching
- **By Name**: Searches Spotify by artist name
- **By URL**: Extracts artist ID from Spotify URLs
- **By ID**: Direct lookup if Spotify ID is already known

### Data Storage
- **Popularity Score**: 0-100 rating from Spotify
- **Follower Count**: Current Spotify followers
- **Top Tracks**: Artist's most popular songs
- **Albums**: Recent releases and discography
- **Last Sync**: Timestamp of last update

## API Limits and Best Practices

- Spotify allows 100 requests per minute for client credentials flow
- The system caches access tokens automatically
- Failed syncs are logged for debugging
- Manual retry is available through the UI

## Troubleshooting

### "Spotify API credentials not configured"
- Verify `.env.local` has correct `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
- Restart the development server after adding credentials

### "Artist not found on Spotify"
- Try adding the Spotify URL manually in the artist edit form
- Some artists may not be available in Spotify's database
- Check spelling and try alternative artist names

### Rate Limiting
- If you see rate limit errors, wait a few minutes before retrying
- Consider spacing out bulk sync operations

## Security Notes

- Never commit `.env.local` to version control
- Keep your Client Secret private
- Rotate credentials if they're accidentally exposed
- Use different credentials for production vs development