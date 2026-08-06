import * as XLSX from 'xlsx';
import { Student, GradeRecord, ClassRoom, SchoolSettings, TeacherProfile } from '../types';

export const exportLegerExcel = (
  selectedClass: ClassRoom,
  students: Student[],
  grades: GradeRecord[],
  subject: string,
  schoolSettings: SchoolSettings,
  teacherProfile: TeacherProfile
) => {
  const classStudents = students.filter(s => s.classId === selectedClass.id);
  
  // Prepare header info rows
  const excelData: Array<Array<string | number>> = [
    [schoolSettings.schoolName.toUpperCase()],
    [`LEGER NILAI MATA PELAJARAN: ${subject.toUpperCase()}`],
    [`Kelas: ${selectedClass.name} | Tahun Ajaran: ${selectedClass.academicYear}`],
    [`Guru Pengampu: ${teacherProfile.name}`],
    [], // Blank line
    [
      'No',
      'NISN',
      'NIS',
      'Nama Lengkap Siswa',
      'L/P',
      'Tugas 1',
      'Tugas 2',
      'Tugas 3',
      'Rata Tugas (Formula)',
      'UH',
      'UTS',
      'UAS',
      'Nilai Akhir (NA)',
      'Predikat',
    ]
  ];

  const startDataRow = 7; // Excel 1-indexed row 7 is first student

  classStudents.forEach((std, idx) => {
    const rowNum = startDataRow + idx;
    const grd = grades.find(g => g.studentId === std.id && g.subject === subject) || {
      tugas1: 80,
      tugas2: 80,
      tugas3: 80,
      uh: 80,
      uts: 80,
      uas: 80,
      nilaiAkhir: 80,
      predikat: 'B (Baik)',
    };

    // Columns:
    // A: No, B: NISN, C: NIS, D: Nama, E: L/P
    // F: T1, G: T2, H: T3
    // I: Rata Tugas -> =AVERAGE(F7:H7)
    // J: UH, K: UTS, L: UAS
    // M: NA -> =(I7*0.2)+(J7*0.2)+(K7*0.3)+(L7*0.3)
    // N: Predikat

    const avgTugasFormula = `=AVERAGE(F${rowNum}:H${rowNum})`;
    const naFormula = `=ROUND((I${rowNum}*0.2)+(J${rowNum}*0.2)+(K${rowNum}*0.3)+(L${rowNum}*0.3), 1)`;

    excelData.push([
      idx + 1,
      std.nisn,
      std.nis,
      std.name,
      std.gender,
      grd.tugas1,
      grd.tugas2,
      grd.tugas3,
      avgTugasFormula,
      grd.uh,
      grd.uts,
      grd.uas,
      naFormula,
      grd.predikat,
    ]);
  });

  const lastStudentRow = startDataRow + classStudents.length - 1;
  const summaryRowAvg = lastStudentRow + 2;
  const summaryRowMax = summaryRowAvg + 1;
  const summaryRowMin = summaryRowMax + 1;

  // Add Summary Rows with formulas
  excelData.push([]); // blank line
  excelData.push([
    'RATA-RATA KELAS',
    '', '', '', '',
    `=AVERAGE(F${startDataRow}:F${lastStudentRow})`,
    `=AVERAGE(G${startDataRow}:G${lastStudentRow})`,
    `=AVERAGE(H${startDataRow}:H${lastStudentRow})`,
    `=AVERAGE(I${startDataRow}:I${lastStudentRow})`,
    `=AVERAGE(J${startDataRow}:J${lastStudentRow})`,
    `=AVERAGE(K${startDataRow}:K${lastStudentRow})`,
    `=AVERAGE(L${startDataRow}:L${lastStudentRow})`,
    `=AVERAGE(M${startDataRow}:M${lastStudentRow})`,
    ''
  ]);

  excelData.push([
    'NILAI TERTINGGI (MAX)',
    '', '', '', '',
    `=MAX(F${startDataRow}:F${lastStudentRow})`,
    `=MAX(G${startDataRow}:G${lastStudentRow})`,
    `=MAX(H${startDataRow}:H${lastStudentRow})`,
    `=MAX(I${startDataRow}:I${lastStudentRow})`,
    `=MAX(J${startDataRow}:J${lastStudentRow})`,
    `=MAX(K${startDataRow}:K${lastStudentRow})`,
    `=MAX(L${startDataRow}:L${lastStudentRow})`,
    `=MAX(M${startDataRow}:M${lastStudentRow})`,
    ''
  ]);

  excelData.push([
    'NILAI TERENDAH (MIN)',
    '', '', '', '',
    `=MIN(F${startDataRow}:F${lastStudentRow})`,
    `=MIN(G${startDataRow}:G${lastStudentRow})`,
    `=MIN(H${startDataRow}:H${lastStudentRow})`,
    `=MIN(I${startDataRow}:I${lastStudentRow})`,
    `=MIN(J${startDataRow}:J${lastStudentRow})`,
    `=MIN(K${startDataRow}:K${lastStudentRow})`,
    `=MIN(L${startDataRow}:L${lastStudentRow})`,
    `=MIN(M${startDataRow}:M${lastStudentRow})`,
    ''
  ]);

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(excelData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 15 }, // NISN
    { wch: 10 }, // NIS
    { wch: 30 }, // Nama
    { wch: 6 },  // L/P
    { wch: 10 }, // T1
    { wch: 10 }, // T2
    { wch: 10 }, // T3
    { wch: 18 }, // Rata Tugas
    { wch: 10 }, // UH
    { wch: 10 }, // UTS
    { wch: 10 }, // UAS
    { wch: 16 }, // NA
    { wch: 20 }, // Predikat
  ];

  // Merge headers
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 13 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 13 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 13 } },
    // Summary merges
    { s: { r: summaryRowAvg - 1, c: 0 }, e: { r: summaryRowAvg - 1, c: 4 } },
    { s: { r: summaryRowMax - 1, c: 0 }, e: { r: summaryRowMax - 1, c: 4 } },
    { s: { r: summaryRowMin - 1, c: 0 }, e: { r: summaryRowMin - 1, c: 4 } },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Leger ${selectedClass.name}`);

  // Download Excel file
  XLSX.writeFile(workbook, `Leger_Nilai_${subject.replace(/\s+/g, '_')}_${selectedClass.name.replace(/\s+/g, '_')}.xlsx`);
};
