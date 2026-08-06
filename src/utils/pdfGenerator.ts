import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, AttendanceRecord, SchoolSettings, TeacherProfile, RppItem, ClassRoom } from '../types';

export const exportAttendancePdf = (
  selectedClass: ClassRoom,
  students: Student[],
  attendance: AttendanceRecord[],
  monthLabel: string,
  schoolSettings: SchoolSettings,
  teacherProfile: TeacherProfile
) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  let currentY = 12;

  // --- 1. KOP SURAT RESMI SEKOLAH ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(schoolSettings.kopLine1.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;
  doc.text(schoolSettings.kopLine2.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
  currentY += 6;

  doc.setFontSize(14);
  doc.text(schoolSettings.schoolName.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const addressText = `${schoolSettings.address}, ${schoolSettings.city}, ${schoolSettings.province} | Telp: ${schoolSettings.phone}`;
  doc.text(addressText, pageWidth / 2, currentY, { align: 'center' });
  currentY += 4;
  const webEmailText = `Website: ${schoolSettings.website} | Email: ${schoolSettings.email} | NPSN: ${schoolSettings.npsn}`;
  doc.text(webEmailText, pageWidth / 2, currentY, { align: 'center' });
  currentY += 4;

  // Garis Pembatas Kop
  doc.setLineWidth(0.8);
  doc.line(14, currentY, pageWidth - 14, currentY);
  doc.setLineWidth(0.2);
  doc.line(14, currentY + 1, pageWidth - 14, currentY + 1);
  currentY += 8;

  // --- 2. JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`REKAPITULASI PRESENSI & KEHADIRAN SISWA`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;
  doc.setFontSize(10);
  doc.text(`PERIODE: ${monthLabel.toUpperCase()} | KELAS: ${selectedClass.name} (${selectedClass.academicYear})`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;

  // --- 3. METRICS REKAP TABEL DATA ---
  const classStudents = students.filter(s => s.classId === selectedClass.id);
  
  // Build rows for each student
  const tableRows = classStudents.map((std, idx) => {
    const stdAtt = attendance.filter(a => a.studentId === std.id);
    const hCount = stdAtt.filter(a => a.status === 'H').length;
    const sCount = stdAtt.filter(a => a.status === 'S').length;
    const iCount = stdAtt.filter(a => a.status === 'I').length;
    const aCount = stdAtt.filter(a => a.status === 'A').length;
    const totalRecorded = stdAtt.length || 1;
    const pct = Math.round((hCount / totalRecorded) * 100);

    return [
      (idx + 1).toString(),
      std.nisn,
      std.nis,
      std.name,
      std.gender,
      hCount.toString(),
      sCount.toString(),
      iCount.toString(),
      aCount.toString(),
      `${pct}%`,
      pct >= 85 ? 'Sangat Baik' : pct >= 75 ? 'Baik' : pct >= 60 ? 'Cukup' : 'Perlu Perhatian',
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [[
      'No', 
      'NISN', 
      'NIS', 
      'Nama Lengkap Siswa', 
      'L/P', 
      'Hadir (H)', 
      'Sakit (S)', 
      'Izin (I)', 
      'Alpa (A)', 
      '% Kehadiran', 
      'Keterangan'
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // Slate 800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 26 },
      2: { halign: 'center', cellWidth: 18 },
      3: { cellWidth: 70 },
      4: { halign: 'center', cellWidth: 12 },
      5: { halign: 'center', cellWidth: 20 },
      6: { halign: 'center', cellWidth: 20 },
      7: { halign: 'center', cellWidth: 20 },
      8: { halign: 'center', cellWidth: 20 },
      9: { halign: 'center', cellWidth: 24 },
      10: { halign: 'center', cellWidth: 28 },
    },
    margin: { left: 14, right: 14 },
  });

  // Get position after table
  // @ts-expect-error autoTable extends jsPDF doc instance
  const finalY = (doc.lastAutoTable?.finalY || currentY + 40) + 12;

  // --- 4. TANDA TANGAN (KAPALA SEKOLAH & WALI KELAS) ---
  const dateToday = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Check if signature section fits on page
  if (finalY + 40 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
  }

  const sigY = finalY + 40 > doc.internal.pageSize.getHeight() ? 20 : finalY;
  const col1X = 35;
  const col2X = pageWidth - 90;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);

  // Left Side: Kepala Sekolah
  doc.text('Mengetahui,', col1X, sigY);
  doc.text('Kepala Sekolah', col1X, sigY + 5);
  doc.text(schoolSettings.schoolName, col1X, sigY + 10);

  doc.setFont('helvetica', 'bold');
  doc.text(schoolSettings.principalName, col1X, sigY + 30);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${schoolSettings.principalNip}`, col1X, sigY + 35);

  // Right Side: Wali Kelas / Guru
  doc.text(`${schoolSettings.city}, ${dateToday}`, col2X, sigY);
  doc.text(`Wali Kelas / Guru Pengampu,`, col2X, sigY + 5);
  doc.text(`Kelas ${selectedClass.name}`, col2X, sigY + 10);

  doc.setFont('helvetica', 'bold');
  doc.text(teacherProfile.name, col2X, sigY + 30);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${teacherProfile.nip}`, col2X, sigY + 35);

  // Save PDF
  doc.save(`Rekap_Absensi_${selectedClass.name.replace(/\s+/g, '_')}_${monthLabel}.pdf`);
};

export const exportRppPdf = (
  rpp: RppItem,
  schoolSettings: SchoolSettings,
  teacherProfile: TeacherProfile
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  let currentY = 12;

  // KOP SEKOLAH
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(schoolSettings.kopLine1.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;
  doc.text(schoolSettings.kopLine2.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  doc.setFontSize(13);
  doc.text(schoolSettings.schoolName.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`${schoolSettings.address}, ${schoolSettings.city} | Email: ${schoolSettings.email}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 4;

  doc.setLineWidth(0.6);
  doc.line(12, currentY, pageWidth - 12, currentY);
  doc.setLineWidth(0.2);
  doc.line(12, currentY + 0.8, pageWidth - 12, currentY + 0.8);
  currentY += 7;

  // JUDUL MODUL AJAR
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('MODUL AJAR / RPP KURIKULUM MERDEKA', pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;
  doc.setFontSize(10);
  doc.text(rpp.title.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;

  // IDENTITAS MODUL TABLE
  autoTable(doc, {
    startY: currentY,
    theme: 'plain',
    body: [
      ['Mata Pelajaran', ':', rpp.mataPelajaran, 'Fase / Kelas', ':', rpp.faseKelas],
      ['Elemen Domain', ':', rpp.elemen, 'Alokasi Waktu', ':', rpp.alokasiWaktu],
      ['Penyusun', ':', teacherProfile.name, 'Tahun Ajaran', ':', '2026/2027'],
    ],
    styles: { fontSize: 8.5, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 32 },
      1: { cellWidth: 4 },
      2: { cellWidth: 60 },
      3: { fontStyle: 'bold', cellWidth: 30 },
      4: { cellWidth: 4 },
      5: { cellWidth: 50 },
    },
    margin: { left: 12, right: 12 },
  });

  // @ts-expect-error autoTable extends jsPDF doc instance
  currentY = (doc.lastAutoTable?.finalY || currentY + 30) + 6;

  // HELPER SECTION BOX
  const addSectionHeading = (title: string) => {
    doc.setFillColor(241, 245, 249); // Slate 100
    doc.rect(12, currentY, pageWidth - 24, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(title, 14, currentY + 4.2);
    currentY += 8;
  };

  const addBodyBlock = (text: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitText = doc.splitTextToSize(text || '-', pageWidth - 28);
    
    // Check if space needed
    if (currentY + (splitText.length * 4) > 275) {
      doc.addPage();
      currentY = 15;
    }
    
    doc.text(splitText, 14, currentY);
    currentY += splitText.length * 4 + 4;
  };

  // 1. CAPAIAN PEMBELAJARAN
  addSectionHeading('I. CAPAIAN PEMBELAJARAN (CP)');
  addBodyBlock(rpp.capaianPembelajaran);

  // 2. TUJUAN PEMBELAJARAN
  addSectionHeading('II. TUJUAN PEMBELAJARAN (TP)');
  addBodyBlock(rpp.tujuanPembelajaran);

  // 3. KEGIATAN PEMBELAJARAN
  addSectionHeading('III. KEGIATAN PEMBELAJARAN');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('A. Pendahuluan', 14, currentY);
  currentY += 4;
  addBodyBlock(rpp.kegiatanPendahuluan);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('B. Kegiatan Inti', 14, currentY);
  currentY += 4;
  addBodyBlock(rpp.kegiatanInti);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('C. Penutup & Refleksi', 14, currentY);
  currentY += 4;
  addBodyBlock(rpp.kegiatanPenutup);

  // 4. ASESMEN
  addSectionHeading('IV. ASESMEN & EVALUASI');
  addBodyBlock(rpp.asesmen);

  // 5. MEDIA & SUMBER BELAJAR
  addSectionHeading('V. MEDIA DAN SUMBER BELAJAR');
  addBodyBlock(rpp.mediaSumber);

  // TANDA TANGAN
  if (currentY + 40 > 275) {
    doc.addPage();
    currentY = 20;
  } else {
    currentY += 6;
  }

  const dateToday = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const col1X = 20;
  const col2X = pageWidth - 80;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  doc.text('Mengetahui,', col1X, currentY);
  doc.text('Kepala Sekolah', col1X, currentY + 4);
  doc.setFont('helvetica', 'bold');
  doc.text(schoolSettings.principalName, col1X, currentY + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${schoolSettings.principalNip}`, col1X, currentY + 28);

  doc.text(`${schoolSettings.city}, ${dateToday}`, col2X, currentY);
  doc.text('Guru Mata Pelajaran,', col2X, currentY + 4);
  doc.setFont('helvetica', 'bold');
  doc.text(teacherProfile.name, col2X, currentY + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${teacherProfile.nip}`, col2X, currentY + 28);

  doc.save(`Modul_Ajar_${rpp.mataPelajaran}_${rpp.faseKelas.replace(/\s+/g, '_')}.pdf`);
};
