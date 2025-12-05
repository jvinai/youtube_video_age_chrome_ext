// YouTube Video Age Highlighter
// Adds background colors to video publish dates based on age

const AGE_THRESHOLDS = {
  HOURS_24: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  MONTHS_6: 6 * 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
  YEARS_2: 2 * 365 * 24 * 60 * 60 * 1000
};

function parseRelativeTime(text) {
  if (!text) return null;

  const normalizedText = text.toLowerCase().trim();

  // Match patterns like "2 hours ago", "1 day ago", "3 weeks ago", etc.
  const match = normalizedText.match(/(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*ago/);

  if (!match) {
    // Handle "Streamed X ago" format
    const streamedMatch = normalizedText.match(/streamed\s+(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*ago/);
    if (streamedMatch) {
      return calculateAge(parseInt(streamedMatch[1]), streamedMatch[2]);
    }
    return null;
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  return calculateAge(value, unit);
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

const AGE_PATTERN = /^(streamed\s+)?(\d+)\s*(second|minute|hour|day|week|month|year)s?\s+ago$/i;

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
      if (AGE_PATTERN.test(text)) {
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
