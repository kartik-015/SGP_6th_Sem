import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseRoll } from './rollparser.js';
import fsSync from 'fs';

function resolveSamplesDir() {
  const cwd = process.cwd();
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.join(cwd, 'backend', 'samples'),
    path.join(cwd, 'samples'),
    path.join(cwd, '..', 'backend', 'samples'),
    path.join(cwd, '..', 'samples'),
    path.join(scriptDir, '..', 'samples'),
    path.join(scriptDir, '..', '..', 'samples')
  ];
  for (const p of candidates) {
    try {
      if (fsSync.existsSync(p)) return p;
    } catch (e) {
      // ignore
    }
  }
  // fallback to samples next to this utils folder
  return path.join(scriptDir, '..', 'samples');
}

const samplesDir = resolveSamplesDir();

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const hdr = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(l => {
    const cols = l.split(',').map(c => c.trim());
    const obj = {};
    hdr.forEach((h, i) => { obj[h] = cols[i] ?? ''; });
    return obj;
  });
}

function timeToMinutes(t) {
  if (!t) return null;
  const m = String(t).trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  return hh * 60 + mm;
}

export async function checkRollNow(roll) {
  if (!roll) return { free: false, reason: 'no_roll' };
  const parsed = parseRoll(roll);
  if (!parsed) return { free: false, reason: 'bad_roll' };

  const ttRaw = await fs.readFile(path.join(samplesDir, 'Timetable.csv'), 'utf8');
  const csRaw = await fs.readFile(path.join(samplesDir, 'Counsellors.csv'), 'utf8');
  const timetable = parseCSV(ttRaw);
  const counsellors = parseCSV(csRaw);

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const now = new Date();
  const todayName = dayNames[now.getDay()];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const matches = timetable.filter(r => {
    if ((r.Institute || '').toUpperCase() !== (parsed.institute || '').toUpperCase()) return false;
    if ((r.Department || '').toUpperCase() !== (parsed.department || '').toUpperCase()) return false;
    const rowYear = r.Year ? Number(r.Year) : null;
    if (rowYear && parsed.year && rowYear !== parsed.year) return false;
    if (r.Day && r.Day !== todayName) return false;
    return true;
  });

  const busy = matches.find(r => {
    const s = timeToMinutes(r.Start);
    const e = timeToMinutes(r.End);
    if (s == null || e == null) return false;
    return nowMinutes >= s && nowMinutes <= e;
  });

  // Find counsellor
  let counsellor = counsellors.find(c => {
    if ((c.Institute || '').toUpperCase() !== (parsed.institute || '').toUpperCase()) return false;
    if ((c.Department || '').toUpperCase() !== (parsed.department || '').toUpperCase()) return false;
    if (c.Year && Number(c.Year) === Number(parsed.year)) return true;
    return false;
  });
  if (!counsellor) {
    counsellor = counsellors.find(c => (c.Institute || '').toUpperCase() === (parsed.institute || '').toUpperCase() && (c.Department || '').toUpperCase() === (parsed.department || '').toUpperCase());
  }

  return {
    free: !Boolean(busy),
    parsed,
    busyEntry: busy || null,
    counsellor: counsellor || null,
    matches
  };
}
