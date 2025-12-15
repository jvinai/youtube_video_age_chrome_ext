const {
  AGE_THRESHOLDS,
  TIME_UNITS,
  AGO_INDICATORS,
  WATCHING_INDICATORS,
  parseRelativeTime,
  calculateAge,
  getAgeClass,
  isLiveStream,
  looksLikeRelativeTime,
  escapeRegex,
  isInsideComments
} = require('./content.js');

describe('calculateAge', () => {
  test('calculates seconds correctly', () => {
    expect(calculateAge(30, 'second')).toBe(30 * 1000);
  });

  test('calculates minutes correctly', () => {
    expect(calculateAge(5, 'minute')).toBe(5 * 60 * 1000);
  });

  test('calculates hours correctly', () => {
    expect(calculateAge(2, 'hour')).toBe(2 * 60 * 60 * 1000);
  });

  test('calculates days correctly', () => {
    expect(calculateAge(3, 'day')).toBe(3 * 24 * 60 * 60 * 1000);
  });

  test('calculates weeks correctly', () => {
    expect(calculateAge(2, 'week')).toBe(2 * 7 * 24 * 60 * 60 * 1000);
  });

  test('calculates months correctly', () => {
    expect(calculateAge(6, 'month')).toBe(6 * 30 * 24 * 60 * 60 * 1000);
  });

  test('calculates years correctly', () => {
    expect(calculateAge(3, 'year')).toBe(3 * 365 * 24 * 60 * 60 * 1000);
  });

  test('returns 0 for unknown unit', () => {
    expect(calculateAge(5, 'unknown')).toBe(0);
  });
});

describe('getAgeClass', () => {
  test('returns yt-age-less-24h for less than 24 hours', () => {
    expect(getAgeClass(12 * 60 * 60 * 1000)).toBe('yt-age-less-24h');
  });

  test('returns yt-age-less-week for less than a week', () => {
    expect(getAgeClass(3 * 24 * 60 * 60 * 1000)).toBe('yt-age-less-week');
  });

  test('returns yt-age-less-month for less than a month', () => {
    expect(getAgeClass(15 * 24 * 60 * 60 * 1000)).toBe('yt-age-less-month');
  });

  test('returns yt-age-less-6months for less than 6 months', () => {
    expect(getAgeClass(90 * 24 * 60 * 60 * 1000)).toBe('yt-age-less-6months');
  });

  test('returns yt-age-less-year for less than a year', () => {
    expect(getAgeClass(250 * 24 * 60 * 60 * 1000)).toBe('yt-age-less-year');
  });

  test('returns yt-age-less-2years for less than 2 years', () => {
    expect(getAgeClass(500 * 24 * 60 * 60 * 1000)).toBe('yt-age-less-2years');
  });

  test('returns yt-age-more-2years for more than 2 years', () => {
    expect(getAgeClass(800 * 24 * 60 * 60 * 1000)).toBe('yt-age-more-2years');
  });
});

describe('parseRelativeTime - English', () => {
  test('parses "5 minutes ago"', () => {
    expect(parseRelativeTime('5 minutes ago')).toBe(5 * 60 * 1000);
  });

  test('parses "1 hour ago"', () => {
    expect(parseRelativeTime('1 hour ago')).toBe(60 * 60 * 1000);
  });

  test('parses "3 days ago"', () => {
    expect(parseRelativeTime('3 days ago')).toBe(3 * 24 * 60 * 60 * 1000);
  });

  test('parses "2 weeks ago"', () => {
    expect(parseRelativeTime('2 weeks ago')).toBe(2 * 7 * 24 * 60 * 60 * 1000);
  });

  test('parses "6 months ago"', () => {
    expect(parseRelativeTime('6 months ago')).toBe(6 * 30 * 24 * 60 * 60 * 1000);
  });

  test('parses "2 years ago"', () => {
    expect(parseRelativeTime('2 years ago')).toBe(2 * 365 * 24 * 60 * 60 * 1000);
  });

  test('parses "Streamed 3 hours ago"', () => {
    expect(parseRelativeTime('Streamed 3 hours ago')).toBe(3 * 60 * 60 * 1000);
  });

  test('returns null for non-time text', () => {
    expect(parseRelativeTime('Hello world')).toBeNull();
  });

  test('returns null for empty text', () => {
    expect(parseRelativeTime('')).toBeNull();
    expect(parseRelativeTime(null)).toBeNull();
  });
});

describe('parseRelativeTime - French', () => {
  test('parses "il y a 5 minutes"', () => {
    expect(parseRelativeTime('il y a 5 minutes')).toBe(5 * 60 * 1000);
  });

  test('parses "il y a 3 jours"', () => {
    expect(parseRelativeTime('il y a 3 jours')).toBe(3 * 24 * 60 * 60 * 1000);
  });

  test('parses "il y a 2 semaines"', () => {
    expect(parseRelativeTime('il y a 2 semaines')).toBe(2 * 7 * 24 * 60 * 60 * 1000);
  });

  test('parses "il y a 1 an"', () => {
    expect(parseRelativeTime('il y a 1 an')).toBe(365 * 24 * 60 * 60 * 1000);
  });
});

describe('parseRelativeTime - Spanish', () => {
  test('parses "hace 5 minutos"', () => {
    expect(parseRelativeTime('hace 5 minutos')).toBe(5 * 60 * 1000);
  });

  test('parses "hace 3 días"', () => {
    expect(parseRelativeTime('hace 3 días')).toBe(3 * 24 * 60 * 60 * 1000);
  });

  test('parses "hace 2 años"', () => {
    expect(parseRelativeTime('hace 2 años')).toBe(2 * 365 * 24 * 60 * 60 * 1000);
  });
});

describe('parseRelativeTime - German', () => {
  test('parses "vor 5 Minuten"', () => {
    expect(parseRelativeTime('vor 5 Minuten')).toBe(5 * 60 * 1000);
  });

  test('parses "vor 3 Tagen"', () => {
    expect(parseRelativeTime('vor 3 Tagen')).toBe(3 * 24 * 60 * 60 * 1000);
  });

  test('parses "vor 1 Jahr"', () => {
    expect(parseRelativeTime('vor 1 Jahr')).toBe(365 * 24 * 60 * 60 * 1000);
  });
});

describe('parseRelativeTime - Japanese', () => {
  test('parses "5分前"', () => {
    expect(parseRelativeTime('5分前')).toBe(5 * 60 * 1000);
  });

  test('parses "3日前"', () => {
    expect(parseRelativeTime('3日前')).toBe(3 * 24 * 60 * 60 * 1000);
  });

  test('parses "2年前"', () => {
    expect(parseRelativeTime('2年前')).toBe(2 * 365 * 24 * 60 * 60 * 1000);
  });
});

describe('parseRelativeTime - Korean', () => {
  test('parses "5분 전"', () => {
    expect(parseRelativeTime('5분 전')).toBe(5 * 60 * 1000);
  });

  test('parses "3일 전"', () => {
    expect(parseRelativeTime('3일 전')).toBe(3 * 24 * 60 * 60 * 1000);
  });
});

describe('parseRelativeTime - Chinese', () => {
  test('parses "5分钟前"', () => {
    expect(parseRelativeTime('5分钟前')).toBe(5 * 60 * 1000);
  });

  test('parses "3天前"', () => {
    expect(parseRelativeTime('3天前')).toBe(3 * 24 * 60 * 60 * 1000);
  });

  test('parses "2年前"', () => {
    expect(parseRelativeTime('2年前')).toBe(2 * 365 * 24 * 60 * 60 * 1000);
  });
});

describe('parseRelativeTime - Russian', () => {
  test('parses "5 минут назад"', () => {
    expect(parseRelativeTime('5 минут назад')).toBe(5 * 60 * 1000);
  });

  test('parses "3 дня назад"', () => {
    expect(parseRelativeTime('3 дня назад')).toBe(3 * 24 * 60 * 60 * 1000);
  });

  test('parses "2 года назад"', () => {
    expect(parseRelativeTime('2 года назад')).toBe(2 * 365 * 24 * 60 * 60 * 1000);
  });
});

describe('parseRelativeTime - Portuguese', () => {
  test('parses "há 5 minutos"', () => {
    expect(parseRelativeTime('há 5 minutos')).toBe(5 * 60 * 1000);
  });

  test('parses "há 3 dias"', () => {
    expect(parseRelativeTime('há 3 dias')).toBe(3 * 24 * 60 * 60 * 1000);
  });
});

describe('parseRelativeTime - Italian', () => {
  test('parses "5 minuti fa"', () => {
    expect(parseRelativeTime('5 minuti fa')).toBe(5 * 60 * 1000);
  });

  test('parses "3 giorni fa"', () => {
    expect(parseRelativeTime('3 giorni fa')).toBe(3 * 24 * 60 * 60 * 1000);
  });
});

describe('parseRelativeTime - edge cases', () => {
  test('returns null for text without ago indicator', () => {
    expect(parseRelativeTime('Learn JavaScript in 30 days')).toBeNull();
    expect(parseRelativeTime('6 Minutes of content')).toBeNull();
  });
});

describe('isLiveStream', () => {
  test('detects English "watching"', () => {
    expect(isLiveStream('7 watching')).toBe(true);
    expect(isLiveStream('1.2K watching')).toBe(true);
    expect(isLiveStream('100 watching')).toBe(true);
  });

  test('detects French "spectateurs"', () => {
    expect(isLiveStream('7 spectateurs')).toBe(true);
  });

  test('detects Spanish "viendo"', () => {
    expect(isLiveStream('7 viendo')).toBe(true);
  });

  test('detects German "Zuschauer"', () => {
    expect(isLiveStream('7 Zuschauer')).toBe(true);
  });

  test('detects Japanese "視聴中"', () => {
    expect(isLiveStream('7人が視聴中')).toBe(true);
  });

  test('detects Korean "시청 중"', () => {
    expect(isLiveStream('7명 시청 중')).toBe(true);
  });

  test('detects Russian "смотрят"', () => {
    expect(isLiveStream('7 смотрят')).toBe(true);
  });

  test('returns false for non-live text', () => {
    expect(isLiveStream('3 days ago')).toBe(false);
    expect(isLiveStream('Hello world')).toBe(false);
  });

  test('returns false for empty/null text', () => {
    expect(isLiveStream('')).toBe(false);
    expect(isLiveStream(null)).toBe(false);
  });
});

describe('looksLikeRelativeTime', () => {
  test('returns true for valid relative time text', () => {
    expect(looksLikeRelativeTime('3 days ago')).toBe(true);
    expect(looksLikeRelativeTime('il y a 5 minutes')).toBe(true);
  });

  test('returns false for text without number', () => {
    expect(looksLikeRelativeTime('hello ago')).toBe(false);
  });

  test('returns false for text without ago indicator', () => {
    expect(looksLikeRelativeTime('3 days')).toBe(false);
  });

  test('returns false for text that is too long', () => {
    const longText = 'This is a very long text that should not be matched as a relative time because it exceeds the maximum length';
    expect(looksLikeRelativeTime(longText)).toBe(false);
  });
});

describe('escapeRegex', () => {
  test('escapes special regex characters', () => {
    expect(escapeRegex('test.string')).toBe('test\\.string');
    expect(escapeRegex('test*string')).toBe('test\\*string');
    expect(escapeRegex('test+string')).toBe('test\\+string');
    expect(escapeRegex('test?string')).toBe('test\\?string');
    expect(escapeRegex('test[string]')).toBe('test\\[string\\]');
  });

  test('leaves normal strings unchanged', () => {
    expect(escapeRegex('normal string')).toBe('normal string');
  });
});

describe('constants', () => {
  test('AGE_THRESHOLDS has correct values', () => {
    expect(AGE_THRESHOLDS.HOURS_24).toBe(24 * 60 * 60 * 1000);
    expect(AGE_THRESHOLDS.WEEK).toBe(7 * 24 * 60 * 60 * 1000);
    expect(AGE_THRESHOLDS.MONTH).toBe(30 * 24 * 60 * 60 * 1000);
    expect(AGE_THRESHOLDS.YEAR).toBe(365 * 24 * 60 * 60 * 1000);
  });

  test('TIME_UNITS contains all expected units', () => {
    expect(TIME_UNITS).toHaveProperty('second');
    expect(TIME_UNITS).toHaveProperty('minute');
    expect(TIME_UNITS).toHaveProperty('hour');
    expect(TIME_UNITS).toHaveProperty('day');
    expect(TIME_UNITS).toHaveProperty('week');
    expect(TIME_UNITS).toHaveProperty('month');
    expect(TIME_UNITS).toHaveProperty('year');
  });

  test('AGO_INDICATORS contains English "ago"', () => {
    expect(AGO_INDICATORS).toContain('ago');
  });

  test('WATCHING_INDICATORS contains English "watching"', () => {
    expect(WATCHING_INDICATORS).toContain('watching');
  });
});

describe('isInsideComments', () => {
  test('returns true for element inside ytd-comments', () => {
    const commentsSection = document.createElement('ytd-comments');
    const span = document.createElement('span');
    commentsSection.appendChild(span);
    document.body.appendChild(commentsSection);
    expect(isInsideComments(span)).toBe(true);
    document.body.removeChild(commentsSection);
  });

  test('returns true for element inside ytd-comment-thread-renderer', () => {
    const commentThread = document.createElement('ytd-comment-thread-renderer');
    const span = document.createElement('span');
    commentThread.appendChild(span);
    document.body.appendChild(commentThread);
    expect(isInsideComments(span)).toBe(true);
    document.body.removeChild(commentThread);
  });

  test('returns true for element inside ytd-comment-renderer', () => {
    const comment = document.createElement('ytd-comment-renderer');
    const span = document.createElement('span');
    comment.appendChild(span);
    document.body.appendChild(comment);
    expect(isInsideComments(span)).toBe(true);
    document.body.removeChild(comment);
  });

  test('returns true for element inside ytd-comment-view-model', () => {
    const comment = document.createElement('ytd-comment-view-model');
    const span = document.createElement('span');
    comment.appendChild(span);
    document.body.appendChild(comment);
    expect(isInsideComments(span)).toBe(true);
    document.body.removeChild(comment);
  });

  test('returns true for element inside element with id="comments"', () => {
    const comments = document.createElement('div');
    comments.id = 'comments';
    const span = document.createElement('span');
    comments.appendChild(span);
    document.body.appendChild(comments);
    expect(isInsideComments(span)).toBe(true);
    document.body.removeChild(comments);
  });

  test('returns false for element outside comments', () => {
    const videoRenderer = document.createElement('ytd-video-renderer');
    const span = document.createElement('span');
    videoRenderer.appendChild(span);
    document.body.appendChild(videoRenderer);
    expect(isInsideComments(span)).toBe(false);
    document.body.removeChild(videoRenderer);
  });
});
