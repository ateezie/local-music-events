# 📧 Mailparser Setup Guide for Event Automation

## Your Mailparser Email Address
**lxwupbiw@mailparser.io**

Use this email to subscribe to all promoter newsletters.

## Webhook Configuration

In your Mailparser dashboard, configure the webhook URL:
```
https://your-domain.com/api/events/import-from-email
```

## Parsing Rules Examples

### 1. Event Title Extraction
**Field Name:** `event_title`
**Parsing Rule:** Look for patterns like:
- Subject line without "Newsletter:" prefix
- Lines starting with "UPCOMING:" or "THIS WEEK:"
- Headers in bold text

**Example Patterns:**
```
Subject: Newsletter: House Vibes with The Velvet Echoes
Extract: House Vibes with The Velvet Echoes

UPCOMING: Dubstep Warehouse Show featuring Chaos Theory
Extract: Dubstep Warehouse Show featuring Chaos Theory
```

### 2. Date Extraction
**Field Name:** `event_date`
**Parsing Rule:** Look for date patterns:
- `Saturday, August 15`
- `8/15/2025`
- `2025-08-15`

**Regex Pattern:** `\b\w+day,?\s+\w+\s+\d{1,2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}`

### 3. Time Extraction  
**Field Name:** `event_time`
**Parsing Rule:** Look for time patterns:
- `8:00 PM`
- `20:00`
- `8 PM`

**Regex Pattern:** `\d{1,2}:\d{2}\s*(?:AM|PM)|\d{1,2}\s*(?:AM|PM)`

### 4. Venue Extraction
**Field Name:** `venue_name`
**Parsing Rule:** Look for venue indicators:
- "at [Venue Name]"
- "@ [Venue Name]"
- "Venue: [Venue Name]"

**Example Patterns:**
```
at The Music Hall, 123 Main Street
Extract: The Music Hall

@ Pulse Nightclub
Extract: Pulse Nightclub

Venue: Blue Note Café
Extract: Blue Note Café
```

### 5. Artists Extraction
**Field Name:** `artists`
**Parsing Rule:** Look for artist patterns:
- "featuring [Artist]"
- "with [Artist] + [Artist]"
- "[Artist] & [Artist]"

**Example Patterns:**
```
featuring The Velvet Echoes + Moonlight Drive
Extract: The Velvet Echoes + Moonlight Drive

DJ Synthwave with special guests
Extract: DJ Synthwave
```

### 6. Genre Detection
**Field Name:** `genre`
**Parsing Rule:** Look for genre keywords:
- house, deep house, tech house
- drum and bass, dnb, liquid dnb
- uk garage, garage, ukg
- dubstep, bass music
- trance, progressive trance
- techno, minimal techno

### 7. Price Extraction
**Field Name:** `price`
**Parsing Rule:** Look for price patterns:
- `$25-30`
- `$15 advance`
- `Free`
- `No cover`

**Regex Pattern:** `\$\d+(?:-\$?\d+)?|free|no cover`

### 8. Ticket URL Extraction
**Field Name:** `ticket_url`
**Parsing Rule:** Look for ticket-related URLs:
- URLs containing "ticket", "event", "buy"
- Eventbrite, Ticketmaster, Facebook event links

### 9. Promoter Detection
**Field Name:** `promoter`
**Parsing Rule:** Extract from email sender or signature:
- From email domain mapping
- Signature lines
- "Presented by [Promoter]"

## Email-to-Promoter Mapping

Configure these in your parsing rules or webhook logic:

```javascript
const promoterMapping = {
  'downtownmusic.com': 'Downtown Music Collective',
  'undergroundcollective.com': 'Underground Music Collective', 
  'basslineevents.com': 'Bassline Events',
  'clubcircuit.com': 'Club Circuit',
  'communitycollective.com': 'Community Collective'
}
```

## Testing Your Rules

1. **Subscribe to newsletters** using `lxwupbiw@mailparser.io`
2. **Wait for test emails** from promoters
3. **Check extraction results** in Mailparser dashboard
4. **Refine rules** based on actual newsletter formats
5. **Test webhook delivery** to your import endpoint

## Common Newsletter Formats

### Downtown Music Collective (House Events)
```
Subject: DTMC Newsletter - This Weekend's House Vibes

🎵 THIS WEEKEND 🎵

HOUSE VIBES with The Velvet Echoes
Saturday, August 15 at 8:00 PM
The Music Hall, 123 Main Street
Tickets: $25-30
https://tickets.example.com/house-vibes
```

### Bassline Events (DnB/UKG)
```
Subject: Bassline Events - Drum & Bass Night

DRUM & BASS NIGHT
Marcus Johnson Trio
Wednesday, August 12, 7:30 PM
Blue Note Café
$35-45 | 18+
Get tickets: https://bassline.example.com/dnb-night
```

### Club Circuit (Trance)
```
Subject: Club Circuit Weekly - Trance Journey

✨ TRANCE NIGHT ✨
DJ Synthwave + Guests
Friday 8/16 @ 10 PM
Pulse Nightclub
$30-40 advance | 21+
```

## Pro Tips

1. **Start Simple:** Begin with basic title and date extraction
2. **Iterate:** Improve rules as you see real newsletter formats
3. **Use Fallbacks:** Configure multiple extraction patterns for each field
4. **Monitor Results:** Check the import review dashboard regularly
5. **Manual Backup:** Always have manual event entry as a fallback

## Webhook Security

Add these headers to verify authentic requests:
- Check `User-Agent` contains "Mailparser"
- Optionally add webhook secret verification
- Log all requests for debugging

---

**Next Steps:**
1. Subscribe to promoter newsletters with your Mailparser email
2. Configure parsing rules in Mailparser dashboard
3. Set up webhook URL pointing to your import endpoint
4. Monitor the admin import review dashboard for results!