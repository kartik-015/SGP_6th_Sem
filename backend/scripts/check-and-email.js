// check-and-email.js
// Usage: node backend/scripts/check-and-email.js 23DIT015
import fs from 'fs/promises';
import path from 'path';

import { fileURLToPath } from 'url';

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
			const exists = require('fs').existsSync(p);
			if (exists) return p;
		} catch (e) {}
	}
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

async function loadSamples() {
	const ttRaw = await fs.readFile(path.join(samplesDir, 'Timetable.csv'), 'utf8');
	const csRaw = await fs.readFile(path.join(samplesDir, 'Counsellors.csv'), 'utf8');
	const timetable = parseCSV(ttRaw);
	const counsellors = parseCSV(csRaw);
	return { timetable, counsellors };
}

async function main() {
	const roll = process.argv[2] || process.env.ROLL || null;
	if (!roll) {
		console.error('Please provide a roll as an argument, e.g. node check-and-email.js 23DIT015');
		process.exit(2);
	}

	const { parseRoll } = (await import('../utils/rollparser.js'));
	const parsed = parseRoll(roll);
	if (!parsed) {
		console.error('Could not parse roll:', roll);
		process.exit(3);
	}

	const { timetable, counsellors } = await loadSamples();

	const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	const now = new Date();
	const todayName = dayNames[now.getDay()];
	const nowMinutes = now.getHours() * 60 + now.getMinutes();

	// Find timetable rows matching institute, department and year (or semester)
	const matches = timetable.filter(r => {
		if (!r) return false;
		if ((r.Institute || '').toUpperCase() !== (parsed.institute || '').toUpperCase()) return false;
		if ((r.Department || '').toUpperCase() !== (parsed.department || '').toUpperCase()) return false;
		const rowYear = r.Year ? Number(r.Year) : null;
		if (rowYear && parsed.year && rowYear !== parsed.year) return false;
		if (r.Day && r.Day !== todayName) return false;
		return true;
	});

	// Always show matched timetable rows for visibility
	if (matches.length === 0) {
		console.log(`No timetable rows found for ${parsed.institute} ${parsed.department} year ${parsed.year} on ${todayName}.`);
	} else {
		console.log(`Timetable rows matching institute=${parsed.institute} department=${parsed.department} year=${parsed.year} on ${todayName}:`);
		matches.forEach(r => console.log('-', `${r.Start || ''}-${r.End || ''}`, r.Subject || '', `Room:${r.Room || ''}`));
	}

	const busyEntries = matches.filter(r => {
		const s = timeToMinutes(r.Start);
		const e = timeToMinutes(r.End);
		if (s == null || e == null) return false;
		return nowMinutes >= s && nowMinutes <= e;
	});

	// Find counsellor by Institute + Department + Year (preferred) or fallback to any for dept
	let counsellor = counsellors.find(c => {
		if (!c) return false;
		if ((c.Institute || '').toUpperCase() !== (parsed.institute || '').toUpperCase()) return false;
		if ((c.Department || '').toUpperCase() !== (parsed.department || '').toUpperCase()) return false;
		if (c.Year && Number(c.Year) === Number(parsed.year)) return true;
		return false;
	});
	if (!counsellor) {
		counsellor = counsellors.find(c => (c.Institute || '').toUpperCase() === (parsed.institute || '').toUpperCase() && (c.Department || '').toUpperCase() === (parsed.department || '').toUpperCase());
	}

	if (!counsellor) {
		console.warn('No counsellor found for', parsed.department, 'year', parsed.year);
	} else {
		const counsellorEmail = counsellor.Email || counsellor.EmailAddress || counsellor.email;
		const counsellorName = counsellor.Name || counsellor.name || 'Counsellor';
		console.log(`Counsellor: ${counsellorName} <${counsellorEmail}>`);
	}

	if (busyEntries.length === 0) {
		console.log(`Student ${roll} (dept=${parsed.department}, year=${parsed.year}) is FREE right now (${todayName} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}).`);
		process.exit(0);
	}

	console.log(`Student ${roll} is BUSY right now. Matching timetable entries:`);
	busyEntries.forEach(be => console.log('-', be.Subject || `${be.Start}-${be.End}`, `in ${be.Room || ''}`));

	// Compose email
	const counsellorEmail = (counsellor && (counsellor.Email || counsellor.EmailAddress || counsellor.email)) || null;
	if (!counsellorEmail) {
		console.error('No counsellor email found to notify.');
		process.exit(4);
	}

	const subject = `Approval request: student ${roll} attempted to borrow during class`;
	const text = `Dear ${counsellor.Name || counsellor.Name || 'Counsellor'},\n\nStudent ${roll} (Dept: ${parsed.department}, Year: ${parsed.year}) attempted to borrow equipment during their scheduled class (${busyEntries.map(b=>b.Subject).join(', ')}). Please review and approve or deny the request.`;

	// Try to send email using existing util if SMTP is configured, otherwise simulate
	let emailUtil;
	try { emailUtil = await import('../utils/email.js'); } catch (e) { emailUtil = null; }
	const smtpConfigured = Boolean(process.env.SMTP_USER || process.env.SMTP_PASS || process.env.EMAIL_USER || process.env.EMAIL_PASS);

	if (!emailUtil || !emailUtil.sendEmail || !smtpConfigured) {
		console.log('SMTP not configured or email util unavailable — simulation:');
		console.log('To:', counsellorEmail);
		console.log('Subject:', subject);
		console.log('Body:', text);
		process.exit(0);
	}

	try {
		const info = await emailUtil.sendEmail({ to: counsellorEmail, subject, text });
		console.log('Email sent, transport result:', info);
		process.exit(0);
	} catch (err) {
		console.error('Failed to send email:', err.message || err);
		process.exit(5);
	}
}

main().catch(e=>{ console.error('Unexpected error:', e); process.exit(99); });
