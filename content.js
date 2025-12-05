// YouTube Video Age Highlighter
// Adds background colors to video publish dates based on age
// Multi-language support based on CLDR data

const AGE_THRESHOLDS = {
  HOURS_24: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  MONTHS_6: 6 * 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
  YEARS_2: 2 * 365 * 24 * 60 * 60 * 1000
};

// Time unit translations for all major YouTube languages
// Maps localized unit names to canonical English units
const TIME_UNITS = {
  second: [
    'second', 'seconds', 'sec', 'secs', 's',
    'seconde', 'secondes',           // French
    'segundo', 'segundos', 'seg',    // Spanish/Portuguese
    'sekunde', 'sekunden', 'sek',    // German
    'secondo', 'secondi',            // Italian
    'секунда', 'секунды', 'секунд', 'сек', // Russian
    'секунду',                       // Russian accusative
    'sekunda', 'sekundy', 'sekund',  // Polish
    'seconden',                      // Dutch
    'saniye', 'sn',                  // Turkish
    'giây',                          // Vietnamese
    'วินาที',                         // Thai
    'सेकंड', 'से॰',                   // Hindi
    'ثانية', 'ثوانٍ', 'ثوان',         // Arabic
    '秒', '秒钟',                      // Chinese
    '秒',                            // Japanese
    '초',                            // Korean
  ],
  minute: [
    'minute', 'minutes', 'min', 'mins', 'm',
    'minuto', 'minutos',             // Spanish/Italian/Portuguese
    'минута', 'минуты', 'минут', 'мин', // Russian
    'минуту',                        // Russian accusative
    'minuta', 'minuty', 'minut',     // Polish
    'minuten', 'minuut',             // Dutch
    'dakika', 'dk',                  // Turkish
    'phút',                          // Vietnamese
    'นาที',                           // Thai
    'मिनट', 'मि॰',                    // Hindi
    'دقيقة', 'دقائق',                 // Arabic
    '分', '分钟',                      // Chinese
    '分',                            // Japanese
    '분',                            // Korean
  ],
  hour: [
    'hour', 'hours', 'hr', 'hrs', 'h',
    'heure', 'heures',               // French
    'hora', 'horas',                 // Spanish/Portuguese
    'stunde', 'stunden', 'std',      // German
    'ora', 'ore',                    // Italian
    'час', 'часа', 'часов', 'ч',     // Russian
    'godzina', 'godziny', 'godzin', 'godz', 'g', // Polish
    'uur',                           // Dutch
    'saat', 'sa',                    // Turkish
    'giờ',                           // Vietnamese
    'ชั่วโมง',                         // Thai
    'घंटा', 'घंटे', 'घं॰',             // Hindi
    'ساعة', 'ساعات',                  // Arabic
    '小时',                           // Chinese
    '時間',                           // Japanese
    '시간',                           // Korean
  ],
  day: [
    'day', 'days', 'd',
    'jour', 'jours', 'j',            // French
    'día', 'dias', 'día', 'días',    // Spanish
    'dia', 'dias',                   // Portuguese
    'tag', 'tage', 'tagen',          // German
    'giorno', 'giorni', 'gg', 'g',   // Italian
    'день', 'дня', 'дней', 'дн',     // Russian
    'dzień', 'dni',                  // Polish
    'dag', 'dagen', 'dgn',           // Dutch
    'gün',                           // Turkish
    'ngày',                          // Vietnamese
    'วัน',                            // Thai
    'दिन',                           // Hindi
    'يوم', 'يومين', 'أيام',           // Arabic
    '天', '日',                        // Chinese
    '日',                            // Japanese
    '일',                            // Korean
  ],
  week: [
    'week', 'weeks', 'wk', 'wks', 'w',
    'semaine', 'semaines', 'sem',    // French
    'semana', 'semanas',             // Spanish/Portuguese
    'woche', 'wochen', 'wo',         // German
    'settimana', 'settimane', 'sett', // Italian
    'неделя', 'недели', 'недель', 'нед', // Russian
    'неделю',                        // Russian accusative
    'tydzień', 'tygodnie', 'tygodni', // Polish
    'week', 'weken',                 // Dutch
    'hafta', 'hf',                   // Turkish
    'tuần',                          // Vietnamese
    'สัปดาห์',                         // Thai
    'हफ़्ता', 'हफ्ते', 'सप्ताह',        // Hindi
    'أسبوع', 'أسابيع', 'أسبوعين',     // Arabic
    '周', '週',                        // Chinese
    '週間',                           // Japanese
    '주',                            // Korean
  ],
  month: [
    'month', 'months', 'mo', 'mos',
    'mois',                          // French
    'mes', 'meses',                  // Spanish
    'mês', 'meses',                  // Portuguese
    'monat', 'monate', 'monaten',    // German
    'mese', 'mesi',                  // Italian
    'месяц', 'месяца', 'месяцев', 'мес', // Russian
    'miesiąc', 'miesiące', 'miesięcy', // Polish
    'maand', 'maanden',              // Dutch
    'ay',                            // Turkish
    'tháng',                         // Vietnamese
    'เดือน',                          // Thai
    'महीना', 'महीने', 'माह',          // Hindi
    'شهر', 'شهرين', 'أشهر',          // Arabic
    '个月', '月',                      // Chinese
    'か月', 'ヶ月',                    // Japanese
    '개월',                           // Korean
  ],
  year: [
    'year', 'years', 'yr', 'yrs', 'y',
    'an', 'ans', 'année', 'années', 'a', // French
    'año', 'años',                   // Spanish
    'ano', 'anos',                   // Portuguese
    'jahr', 'jahre', 'jahren', 'j',  // German
    'anno', 'anni',                  // Italian
    'год', 'года', 'лет', 'г', 'л',  // Russian
    'rok', 'lata', 'lat',            // Polish
    'jaar',                          // Dutch
    'yıl',                           // Turkish
    'năm',                           // Vietnamese
    'ปี',                             // Thai
    'साल', 'वर्ष',                    // Hindi
    'سنة', 'سنتين', 'سنوات',          // Arabic
    '年',                            // Chinese/Japanese/Korean
  ]
};

// "Ago" indicators in different languages
// These appear either before or after the number+unit
const AGO_INDICATORS = [
  // Suffix (after number+unit)
  'ago',                             // English
  'назад',                           // Russian
  'temu',                            // Polish
  'geleden',                         // Dutch
  'fa',                              // Italian
  'önce',                            // Turkish
  'trước',                           // Vietnamese
  'ที่แล้ว', 'ที่ผ่านมา',              // Thai
  'पहले',                            // Hindi
  '前',                              // Chinese/Japanese/Korean
  '전',                              // Korean
  // Prefix (before number+unit)
  'il y a',                          // French
  'hace',                            // Spanish
  'há',                              // Portuguese
  'vor',                             // German
  'قبل',                             // Arabic
];

// Streamed/Live indicators
const STREAMED_INDICATORS = [
  'streamed', 'diffusé', 'transmitido', 'gestreamt', 'trasmesso',
  'транслировалось', 'transmitowane', 'gestreamd', 'yayınlandı',
  'đã phát', 'ถ่ายทอดสด', 'स्ट्रीम किया गया', 'تم البث',
  '配信済み', 'ストリーミング', '스트리밍', '直播',
];

// Build regex pattern for time units
const timeUnitPattern = Object.values(TIME_UNITS).flat().join('|');
const agoPattern = AGO_INDICATORS.join('|');
const streamedPattern = STREAMED_INDICATORS.join('|');

function parseRelativeTime(text) {
  if (!text) return null;

  const normalizedText = text.toLowerCase().trim();

  // Try to extract number and unit from text
  // Pattern 1: "[prefix] N unit [suffix]" (e.g., "il y a 3 jours", "3 days ago", "3日前")
  // Pattern 2: "streamed N unit ago"

  // First, find any number in the text
  const numberMatch = normalizedText.match(/(\d+)/);
  if (!numberMatch) return null;

  const value = parseInt(numberMatch[1]);

  // Check if text contains any "ago" indicator
  const hasAgoIndicator = AGO_INDICATORS.some(indicator =>
    normalizedText.includes(indicator.toLowerCase())
  );

  if (!hasAgoIndicator) return null;

  // Find which time unit is present
  let matchedUnit = null;
  for (const [unit, translations] of Object.entries(TIME_UNITS)) {
    for (const translation of translations) {
      // Use word boundary or character boundary matching
      // For CJK characters, just check if present
      const isCJK = /[\u3000-\u9fff\uac00-\ud7af]/.test(translation);
      if (isCJK) {
        if (normalizedText.includes(translation)) {
          matchedUnit = unit;
          break;
        }
      } else {
        // For non-CJK, use word boundary
        const regex = new RegExp(`\\b${escapeRegex(translation)}\\b`, 'i');
        if (regex.test(normalizedText)) {
          matchedUnit = unit;
          break;
        }
      }
    }
    if (matchedUnit) break;
  }

  if (!matchedUnit) return null;

  return calculateAge(value, matchedUnit);
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function calculateAge(value, unit) {
  const multipliers = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000
  };

  return value * (multipliers[unit] || 0);
}

function getAgeClass(ageInMs) {
  if (ageInMs < AGE_THRESHOLDS.HOURS_24) {
    return 'yt-age-less-24h';
  } else if (ageInMs < AGE_THRESHOLDS.WEEK) {
    return 'yt-age-less-week';
  } else if (ageInMs < AGE_THRESHOLDS.MONTH) {
    return 'yt-age-less-month';
  } else if (ageInMs < AGE_THRESHOLDS.MONTHS_6) {
    return 'yt-age-less-6months';
  } else if (ageInMs < AGE_THRESHOLDS.YEAR) {
    return 'yt-age-less-year';
  } else if (ageInMs < AGE_THRESHOLDS.YEARS_2) {
    return 'yt-age-less-2years';
  } else {
    return 'yt-age-more-2years';
  }
}

// Language-agnostic pattern: just check if text is short and contains a number
// The actual language matching is done in parseRelativeTime()
function looksLikeRelativeTime(text) {
  // Text should be relatively short (typical date strings are under 50 chars)
  if (text.length > 60) return false;
  // Must contain at least one number
  if (!/\d+/.test(text)) return false;
  // Should contain an "ago" indicator
  return AGO_INDICATORS.some(indicator => text.toLowerCase().includes(indicator.toLowerCase()));
}

function highlightElement(element) {
  // Skip if already processed
  if (element.dataset.ageHighlighted) return;

  const text = element.textContent.trim();
  const ageInMs = parseRelativeTime(text);

  if (ageInMs !== null) {
    // Remove any existing age classes
    element.classList.remove(
      'yt-age-less-24h',
      'yt-age-less-week',
      'yt-age-less-month',
      'yt-age-less-6months',
      'yt-age-less-year',
      'yt-age-less-2years',
      'yt-age-more-2years'
    );

    const ageClass = getAgeClass(ageInMs);
    element.classList.add(ageClass);
    element.classList.add('yt-age-highlight');
    element.dataset.ageHighlighted = 'true';
  }
}

function highlightDateElements() {
  // Comprehensive selectors for YouTube date/time elements across different layouts
  // Sources: github.com/jprevo/youtube-popularity-remover, github.com/garygcchiu/YouTube-Recommendations-Filter
  const selectors = [
    // Modern YouTube (2024+) - ViewModel-based components
    'span.yt-content-metadata-view-model__metadata-text',
    'span.yt-core-attributed-string.yt-content-metadata-view-model__metadata-text',
    'yt-formatted-string.yt-content-metadata-view-model__metadata-text',

    // Standard metadata line selectors (home, search, subscriptions)
    '#metadata-line span.inline-metadata-item',
    '#metadata-line > span:nth-child(2)',  // Date is typically 2nd span
    '#metadata-line span',

    // Video meta block variants
    'span.ytd-video-meta-block.style-scope.inline-metadata-item',
    'span.ytd-video-meta-block',
    '#metadata span.style-scope.ytd-video-meta-block',

    // Grid renderer (channel pages, some home layouts)
    'span.ytd-grid-video-renderer.style-scope',
    'ytd-grid-video-renderer #metadata-line span',

    // Rich item renderer (modern home/subscriptions)
    'ytd-rich-item-renderer #metadata-line span',
    'ytd-rich-item-renderer span.ytd-video-meta-block',

    // Video renderer (search results)
    'ytd-video-renderer #metadata-line span',
    'ytd-video-renderer span.inline-metadata-item',

    // Compact video renderer (sidebar, playlists)
    'ytd-compact-video-renderer #metadata-line span',
    'ytd-compact-video-renderer span.inline-metadata-item',

    // Published time on video watch page
    '#published-time-text',
    'yt-formatted-string#published-time-text',
    '#info-strings yt-formatted-string',

    // Reel/Shorts shelf
    'ytd-reel-item-renderer span.ytd-video-meta-block',

    // Playlist renderer
    'ytd-playlist-video-renderer #metadata-line span'
  ];

  // First pass: use known selectors (fast)
  const knownElements = document.querySelectorAll(selectors.join(', '));
  knownElements.forEach(highlightElement);

  // Second pass: fallback for unknown layouts - find any span with "ago" text
  // Only search within video containers to limit scope
  const videoContainers = document.querySelectorAll(
    'ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ' +
    'ytd-playlist-video-renderer, ytd-reel-item-renderer, ytd-radio-renderer, ytd-movie-renderer, ' +
    'ytd-rich-grid-media, ytd-video-preview, ytd-shelf-renderer, ' +
    '[class*="lockup"], [class*="video-item"], [class*="yt-lockup"], [class*="media-item"]'
  );

  videoContainers.forEach(container => {
    // Find spans that might contain dates but weren't caught by known selectors
    container.querySelectorAll('span:not([data-age-highlighted])').forEach(span => {
      const text = span.textContent.trim();
      // Only match if text looks like a relative time (avoid matching nested elements)
      if (looksLikeRelativeTime(text)) {
        highlightElement(span);
      }
    });
  });
}

// Run on initial load
highlightDateElements();

// Use MutationObserver to handle dynamically loaded content
const observer = new MutationObserver((mutations) => {
  let shouldUpdate = false;

  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      shouldUpdate = true;
      break;
    }
  }

  if (shouldUpdate) {
    // Debounce updates
    clearTimeout(window.ageHighlighterTimeout);
    window.ageHighlighterTimeout = setTimeout(highlightDateElements, 100);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Also run when navigating (YouTube is a SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(highlightDateElements, 500);
  }
}).observe(document, { subtree: true, childList: true });
