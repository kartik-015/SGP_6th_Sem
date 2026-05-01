import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const samplesDir = path.join(process.cwd(), 'samples');
if (!fs.existsSync(samplesDir)) fs.mkdirSync(samplesDir, { recursive: true });

function csvToAoA(csv) {
  return csv.trim().split(/\r?\n/).map(line => line.split(','));
}

const counsellorsCsv = fs.readFileSync(path.join(samplesDir, 'Counsellors.csv'), 'utf8');
const timetableCsv = fs.readFileSync(path.join(samplesDir, 'Timetable.csv'), 'utf8');

const wb = xlsx.utils.book_new();
wb.SheetNames.push('Counsellors');
wb.SheetNames.push('Timetable');
wb.Sheets['Counsellors'] = xlsx.utils.aoa_to_sheet(csvToAoA(counsellorsCsv));
wb.Sheets['Timetable'] = xlsx.utils.aoa_to_sheet(csvToAoA(timetableCsv));

const out = path.join(samplesDir, 'DEPSTAR_samples.xlsx');
xlsx.writeFile(wb, out);
console.log('Wrote', out);
