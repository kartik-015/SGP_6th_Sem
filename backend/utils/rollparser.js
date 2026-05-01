// Utility to parse roll numbers like '23DIT015' into structured student info.
// Rules encoded from your spec:
// - First two digits: admission year (e.g., '23' -> 2023)
// - Middle letters: department code (DIT -> IT, DCE -> CE, DCS -> CSE)
// - Last numeric: unique roll (015)
// - Semester calculation: semesters are 6-month windows starting mid-June (odd) and mid-Dec (even).

function mapDept(code) {
  const c = String(code).toUpperCase();
  if (c.includes('DIT')) return 'IT';
  if (c.includes('DCE')) return 'CE';
  if (c.includes('DCS')) return 'CSE';
  // fallback: remove leading D and return remainder
  if (c.startsWith('D') && c.length>1) return c.slice(1);
  return c;
}

export function parseRoll(roll) {
  if (!roll || typeof roll !== 'string') return null;
  const r = roll.trim();
  // Try to extract first two digits, then letters, then digits
  const m = r.match(/^(\d{2})([A-Za-z]+)(\d{2,4})$/);
  if (!m) return null;
  const adYearShort = parseInt(m[1], 10);
  const admissionYear = 2000 + adYearShort;
  const deptCode = m[2];
  const unique = m[3];
  const department = mapDept(deptCode);
  const institute = 'DEPSTAR';

  // semester calculation: months since June of admissionYear
  const now = new Date();
  // reference start = 1 June of admission year (approx mid-June)
  const startMonth = 6; // June
  const monthsSince = (now.getFullYear() - admissionYear) * 12 + (now.getMonth() + 1 - startMonth);
  const semester = Math.max(1, Math.floor(monthsSince / 6) + 1);
  const year = Math.ceil(semester / 2);

  return {
    rollRaw: roll,
    admissionYear,
    institute,
    department,
    year,
    semester,
    uniqueId: unique,
  };
}

// Example usage:
// parseRoll('23DIT015') => { admissionYear:2023, institute:'DEPSTAR', department:'IT', year:3, semester:5, uniqueId:'015' }

export default { parseRoll };
