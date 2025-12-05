# YouTube Video Age Highlighter

A Chrome extension that highlights YouTube video publish dates with color-coded backgrounds based on how old the video is. Quickly identify fresh content vs. older videos at a glance.

**Works with all YouTube languages!**

## Color Legend

| Age | Color | Hex |
|-----|-------|-----|
| Less than 24 hours | Green | `#4CAF50` |
| Less than 1 week | Light Green | `#8BC34A` |
| Less than 1 month | Lime | `#C0CA33` |
| Less than 6 months | Yellow | `#FBC02D` |
| Less than 1 year | Orange | `#FF9800` |
| Less than 2 years | Deep Orange | `#FF5722` |
| More than 2 years | Red | `#F44336` |
| **Live stream** | Blue circle | `#2196F3` |

Live streams display a blue circle indicator to the right of the viewer count (e.g., "7 watching 🔵").

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the folder containing this extension

## Usage

Once installed, the extension automatically highlights video dates on YouTube:

- **Subscriptions page** (`/feed/subscriptions`)
- **Home page**
- **Search results**
- **Channel pages**
- **Playlist pages**
- **Watch page sidebar**

No configuration needed - it just works.

## Supported Languages

The extension supports all major YouTube interface languages:

| Language | Example |
|----------|---------|
| English | "3 days ago" |
| French | "il y a 3 jours" |
| Spanish | "hace 3 días" |
| German | "vor 3 Tagen" |
| Portuguese | "há 3 dias" |
| Italian | "3 giorni fa" |
| Russian | "3 дня назад" |
| Polish | "3 dni temu" |
| Dutch | "3 dagen geleden" |
| Turkish | "3 gün önce" |
| Vietnamese | "3 ngày trước" |
| Thai | "3 วันที่แล้ว" |
| Hindi | "3 दिन पहले" |
| Arabic | "قبل 3 أيام" |
| Japanese | "3日前" |
| Korean | "3일 전" |
| Chinese | "3天前" |

And many more...

## Technical Notes

YouTube frequently changes their UI through A/B testing. This extension uses:

1. A comprehensive list of known CSS selectors for different YouTube layouts
2. A fallback mechanism that searches for date text patterns within video containers
3. Multi-language support using translations based on [Unicode CLDR](https://cldr.unicode.org/) data

If colors stop appearing after a YouTube update, the fallback should still work. Feel free to open an issue if you find a layout or language that isn't supported.

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main script that finds and highlights dates (includes all language translations)
- `styles.css` - Color definitions using Material Design colors

## Contributing

If you find a language or layout that doesn't work, please open an issue with:
- Your YouTube language setting
- A screenshot of the page
- The text of the date that isn't being highlighted

## License

MIT
