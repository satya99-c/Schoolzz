// Helper to format dates in local timezone (YYYY-MM-DD) avoiding UTC offset shifts
export function getTodayLocalDateStr(dateObj = new Date()) {
  const d = new Date(dateObj);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowLocalDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return getTodayLocalDateStr(d);
}
