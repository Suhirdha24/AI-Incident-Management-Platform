export function safeFormatDate(
  dateVal: any,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  fallback = 'N/A'
): string {
  if (!dateVal) return fallback;
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleString('en-US', options);
  } catch (e) {
    return fallback;
  }
}

export function safeFormatTime(
  dateVal: any,
  options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' },
  fallback = 'N/A'
): string {
  if (!dateVal) return fallback;
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleTimeString([], options);
  } catch (e) {
    return fallback;
  }
}
