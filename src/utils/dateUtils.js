// Format date strictly in Indian Standard Time (Asia/Kolkata - UTC+5:30) in YYYY-MM-DD format
export function getIndianLocalDateStr(dateObj = new Date()) {
  try {
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    const formatter = new Intl.DateTimeFormat('en-CA', options);
    return formatter.format(dateObj);
  } catch (e) {
    // Fallback if Intl timeZone is unsupported
    const d = new Date(dateObj);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

export function getTodayLocalDateStr(dateObj = new Date()) {
  return getIndianLocalDateStr(dateObj);
}

export function getTomorrowLocalDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return getIndianLocalDateStr(d);
}
