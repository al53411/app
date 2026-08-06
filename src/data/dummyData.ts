import { ClassRoom, Student, AttendanceRecord, GradeRecord, RppItem, SchoolSettings, TeacherProfile } from '../types';

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'class-1',
    name: 'X IPA 1',
    gradeLevel: 'Kelas X',
    academicYear: '2026/2027',
    homeroomTeacher: 'Drs. Supriyadi, M.Pd.',
  },
  {
    id: 'class-2',
    name: 'XI IPS 2',
    gradeLevel: 'Kelas XI',
    academicYear: '2026/2027',
    homeroomTeacher: 'Siti Rahmawati, S.Pd.',
  },
];

export const INITIAL_SCHOOL_SETTINGS: SchoolSettings = {
  schoolName: 'SMA NEGERI 1 MANDIRI',
  npsn: '20109842',
  address: 'Jl. Education No. 45, Kecamatan Nusantara',
  city: 'Kota Pendidikan',
  province: 'Jawa Barat',
  phone: '(021) 7890-1234',
  email: 'info@sman1mandiri.sch.id',
  website: 'www.sman1mandiri.sch.id',
  principalName: 'H. Ahmad Dahlan, M.M.',
  principalNip: '19750812 199903 1 002',
  kopLine1: 'DINAS PENDIDIKAN DAN KEBUDAYAAN PROVINSI',
  kopLine2: 'CABANG DINAS PENDIDIKAN WILAYAH III',
  logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=120',
};

export const INITIAL_TEACHER_PROFILE: TeacherProfile = {
  name: 'Budi Santoso, S.Pd., M.Si.',
  nip: '19880415 201402 1 004',
  mainSubject: 'Matematika & IPA',
  homeroomClass: 'X IPA 1',
  email: 'budi.santoso@guru.sma.belajar.id',
  phone: '0812-3456-7890',
};

export const INITIAL_STUDENTS: Student[] = [
  // Class 1: X IPA 1 (15 Students)
  {
    id: 'std-101',
    classId: 'class-1',
    nisn: '0081234501',
    nis: '26101',
    name: 'Aditya Pratama',
    gender: 'L',
    birthPlace: 'Bandung',
    birthDate: '2010-03-14',
    parentName: 'Bambang Pratama',
    parentPhone: '0813-1122-3344',
    address: 'Jl. Merdeka No. 12, Bandung',
  },
  {
    id: 'std-102',
    classId: 'class-1',
    nisn: '0081234502',
    nis: '26102',
    name: 'Anisa Rahmawati',
    gender: 'P',
    birthPlace: 'Jakarta',
    birthDate: '2010-05-20',
    parentName: 'Heri Rahmawan',
    parentPhone: '0813-2233-4455',
    address: 'Jl. Mawar Indah No. 5, Bandung',
  },
  {
    id: 'std-103',
    classId: 'class-1',
    nisn: '0081234503',
    nis: '26103',
    name: 'Bagas Kurniawan',
    gender: 'L',
    birthPlace: 'Cimahi',
    birthDate: '2010-01-08',
    parentName: 'Joko Kurnia',
    parentPhone: '0813-3344-5566',
    address: 'Jl. Gatot Subroto No. 88, Cimahi',
  },
  {
    id: 'std-104',
    classId: 'class-1',
    nisn: '0081234504',
    nis: '26104',
    name: 'Citra Dewi Lestari',
    gender: 'P',
    birthPlace: 'Bogor',
    birthDate: '2010-09-11',
    parentName: 'Agus Lestari',
    parentPhone: '0813-4455-6677',
    address: 'Jl. Sukajadi No. 42, Bandung',
  },
  {
    id: 'std-105',
    classId: 'class-1',
    nisn: '0081234505',
    nis: '26105',
    name: 'Daffa Rizky Ramadhan',
    gender: 'L',
    birthPlace: 'Bandung',
    birthDate: '2010-08-17',
    parentName: 'Rahmat Hidayat',
    parentPhone: '0813-5566-7788',
    address: 'Jl. Sunda No. 19, Bandung',
  },
  {
    id: 'std-106',
    classId: 'class-1',
    nisn: '0081234506',
    nis: '26106',
    name: 'Eka Nur Syamsi',
    gender: 'P',
    birthPlace: 'Sumedang',
    birthDate: '2010-04-02',
    parentName: 'Asep Syamsudin',
    parentPhone: '0813-6677-8899',
    address: 'Jl. Riau No. 101, Bandung',
  },
  {
    id: 'std-107',
    classId: 'class-1',
    nisn: '0081234507',
    nis: '26107',
    name: 'Faris Farhan',
    gender: 'L',
    birthPlace: 'Garut',
    birthDate: '2010-12-25',
    parentName: 'Dedi Farhan',
    parentPhone: '0813-7788-9900',
    address: 'Jl. Cihampelas No. 54, Bandung',
  },
  {
    id: 'std-108',
    classId: 'class-1',
    nisn: '0081234508',
    nis: '26108',
    name: 'Gita Gutawa Putri',
    gender: 'P',
    birthPlace: 'Bandung',
    birthDate: '2010-07-30',
    parentName: 'Erwin Gutawa',
    parentPhone: '0813-8899-0011',
    address: 'Jl. Dago Asri No. 7, Bandung',
  },
  {
    id: 'std-109',
    classId: 'class-1',
    nisn: '0081234509',
    nis: '26109',
    name: 'Hendrik Wijaya',
    gender: 'L',
    birthPlace: 'Tasikmalaya',
    birthDate: '2010-02-19',
    parentName: 'Hendrik Sr.',
    parentPhone: '0813-9900-1122',
    address: 'Jl. Asia Afrika No. 33, Bandung',
  },
  {
    id: 'std-110',
    classId: 'class-1',
    nisn: '0081234510',
    nis: '26110',
    name: 'Indah Permatasari',
    gender: 'P',
    birthPlace: 'Cirebon',
    birthDate: '2010-06-15',
    parentName: 'Surya Permana',
    parentPhone: '0812-1111-2222',
    address: 'Jl. Setiabudi No. 90, Bandung',
  },
  {
    id: 'std-111',
    classId: 'class-1',
    nisn: '0081234511',
    nis: '26111',
    name: 'Kevin Sanjaya',
    gender: 'L',
    birthPlace: 'Banyuwangi',
    birthDate: '2010-08-02',
    parentName: 'Sanjaya Utama',
    parentPhone: '0812-2222-3333',
    address: 'Jl. Buah Batu No. 115, Bandung',
  },
  {
    id: 'std-112',
    classId: 'class-1',
    nisn: '0081234512',
    nis: '26112',
    name: 'Larasati Ningrum',
    gender: 'P',
    birthPlace: 'Surakarta',
    birthDate: '2010-10-05',
    parentName: 'Setyo Ningrum',
    parentPhone: '0812-3333-4444',
    address: 'Jl. Kiaracondong No. 23, Bandung',
  },
  {
    id: 'std-113',
    classId: 'class-1',
    nisn: '0081234513',
    nis: '26113',
    name: 'Muhammad Al-Fatih',
    gender: 'L',
    birthPlace: 'Bandung',
    birthDate: '2010-11-12',
    parentName: 'Umar Al-Farisi',
    parentPhone: '0812-4444-5555',
    address: 'Jl. Pasir Kaliki No. 67, Bandung',
  },
  {
    id: 'std-114',
    classId: 'class-1',
    nisn: '0081234514',
    nis: '26114',
    name: 'Nabila Syakieb',
    gender: 'P',
    birthPlace: 'Bogor',
    birthDate: '2010-01-18',
    parentName: 'Syakieb Husen',
    parentPhone: '0812-5555-6666',
    address: 'Jl. Jamika No. 14, Bandung',
  },
  {
    id: 'std-115',
    classId: 'class-1',
    nisn: '0081234515',
    nis: '26115',
    name: 'Rian Ardianto',
    gender: 'L',
    birthPlace: 'Bantul',
    birthDate: '2010-03-31',
    parentName: 'Ardianto Wibowo',
    parentPhone: '0812-6666-7777',
    address: 'Jl. Ters. Jakarta No. 8, Bandung',
  },

  // Class 2: XI IPS 2 (15 Students)
  {
    id: 'std-201',
    classId: 'class-2',
    nisn: '0079876501',
    nis: '25201',
    name: 'Achmad Zaky',
    gender: 'L',
    birthPlace: 'Sragen',
    birthDate: '2009-02-10',
    parentName: 'Sugiarto',
    parentPhone: '0815-1234-5678',
    address: 'Jl. Pahlawan No. 4, Bandung',
  },
  {
    id: 'std-202',
    classId: 'class-2',
    nisn: '0079876502',
    nis: '25202',
    name: 'Bella Saphira',
    gender: 'P',
    birthPlace: 'Magelang',
    birthDate: '2009-07-07',
    parentName: 'Bambang Saphira',
    parentPhone: '0815-2345-6789',
    address: 'Jl. Dipatiukur No. 89, Bandung',
  },
  {
    id: 'std-203',
    classId: 'class-2',
    nisn: '0079876503',
    nis: '25203',
    name: 'Chandra Wijaya',
    gender: 'L',
    birthPlace: 'Cirebon',
    birthDate: '2009-09-19',
    parentName: 'Gunawan Wijaya',
    parentPhone: '0815-3456-7890',
    address: 'Jl. Naripan No. 21, Bandung',
  },
  {
    id: 'std-204',
    classId: 'class-2',
    nisn: '0079876504',
    nis: '25204',
    name: 'Dian Sastrowardoyo',
    gender: 'P',
    birthPlace: 'Jakarta',
    birthDate: '2009-03-16',
    parentName: 'Ariawan Sastro',
    parentPhone: '0815-4567-8901',
    address: 'Jl. Riau No. 55, Bandung',
  },
  {
    id: 'std-205',
    classId: 'class-2',
    nisn: '0079876505',
    nis: '25205',
    name: 'Eko Yuli Irawan',
    gender: 'L',
    birthPlace: 'Lampung',
    birthDate: '2009-04-24',
    parentName: 'Samirin',
    parentPhone: '0815-5678-9012',
    address: 'Jl. Lengkong Besar No. 34, Bandung',
  },
  {
    id: 'std-206',
    classId: 'class-2',
    nisn: '0079876506',
    nis: '25206',
    name: 'Fitri Tropica',
    gender: 'P',
    birthPlace: 'Bandung',
    birthDate: '2009-09-26',
    parentName: 'Rachmatullah',
    parentPhone: '0815-6789-0123',
    address: 'Jl. Cisitu Indah No. 16, Bandung',
  },
  {
    id: 'std-207',
    classId: 'class-2',
    nisn: '0079876507',
    nis: '25207',
    name: 'Gibran Rakabuming',
    gender: 'L',
    birthPlace: 'Surakarta',
    birthDate: '2009-10-01',
    parentName: 'Joko Widodo',
    parentPhone: '0815-7890-1234',
    address: 'Jl. Veteran No. 3, Bandung',
  },
  {
    id: 'std-208',
    classId: 'class-2',
    nisn: '0079876508',
    nis: '25208',
    name: 'Hania Nurul Aini',
    gender: 'P',
    birthPlace: 'Sukabumi',
    birthDate: '2009-08-14',
    parentName: 'Nurul Huda',
    parentPhone: '0815-8901-2345',
    address: 'Jl. Burangrang No. 77, Bandung',
  },
  {
    id: 'std-209',
    classId: 'class-2',
    nisn: '0079876509',
    nis: '25209',
    name: 'Irfan Bachdim',
    gender: 'L',
    birthPlace: 'Amsterdam',
    birthDate: '2009-08-11',
    parentName: 'Noval Bachdim',
    parentPhone: '0815-9012-3456',
    address: 'Jl. Lombok No. 12, Bandung',
  },
  {
    id: 'std-210',
    classId: 'class-2',
    nisn: '0079876510',
    nis: '25210',
    name: 'Jessica Mila',
    gender: 'P',
    birthPlace: 'Kota Langsa',
    birthDate: '2009-08-03',
    parentName: 'Bambang Manado',
    parentPhone: '0816-1122-3344',
    address: 'Jl. Ciumbuleuit No. 40, Bandung',
  },
  {
    id: 'std-211',
    classId: 'class-2',
    nisn: '0079876511',
    nis: '25211',
    name: 'Kaesang Pangarep',
    gender: 'L',
    birthPlace: 'Surakarta',
    birthDate: '2009-12-25',
    parentName: 'Joko Widodo',
    parentPhone: '0816-2233-4455',
    address: 'Jl. Sunda No. 80, Bandung',
  },
  {
    id: 'std-212',
    classId: 'class-2',
    nisn: '0079876512',
    nis: '25212',
    name: 'Luna Maya',
    gender: 'P',
    birthPlace: 'Denpasar',
    birthDate: '2009-08-26',
    parentName: 'Uut Bambang',
    parentPhone: '0816-3344-5566',
    address: 'Jl. Padjadjaran No. 109, Bandung',
  },
  {
    id: 'std-213',
    classId: 'class-2',
    nisn: '0079876513',
    nis: '25213',
    name: 'Nicholas Saputra',
    gender: 'L',
    birthPlace: 'Jakarta',
    birthDate: '2009-02-24',
    parentName: 'Horst Schunemann',
    parentPhone: '0816-4444-5555',
    address: 'Jl. Ir. H. Juanda No. 150, Bandung',
  },
  {
    id: 'std-214',
    classId: 'class-2',
    nisn: '0079876514',
    nis: '25214',
    name: 'Prilly Latuconsina',
    gender: 'P',
    birthPlace: 'Tangerang',
    birthDate: '2009-10-15',
    parentName: 'Rizal Latuconsina',
    parentPhone: '0816-5555-6666',
    address: 'Jl. Soekarno Hatta No. 250, Bandung',
  },
  {
    id: 'std-215',
    classId: 'class-2',
    nisn: '0079876515',
    nis: '25215',
    name: 'Raffi Ahmad',
    gender: 'L',
    birthPlace: 'Bandung',
    birthDate: '2009-02-17',
    parentName: 'Munawar Ahmad',
    parentPhone: '0816-6666-7777',
    address: 'Jl. Andir No. 64, Bandung',
  },
];

// Generate attendance records for current month (dates 2026-08-01 to 2026-08-06)
export const generateDummyAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const dates = ['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06'];
  
  INITIAL_STUDENTS.forEach((student, index) => {
    dates.forEach((date, dIndex) => {
      // Create realistic distribution (90% Hadir, 5% Sakit, 3% Izin, 2% Alpa)
      let status: 'H' | 'S' | 'I' | 'A' = 'H';
      let notes = '';

      if ((index + dIndex) % 17 === 0) {
        status = 'S';
        notes = 'Surat Dokter';
      } else if ((index + dIndex) % 23 === 0) {
        status = 'I';
        notes = 'Acara Keluarga';
      } else if ((index + dIndex) % 29 === 0) {
        status = 'A';
        notes = 'Tanpa Keterangan';
      }

      records.push({
        id: `att-${student.id}-${date}`,
        studentId: student.id,
        date,
        status,
        notes,
      });
    });
  });

  return records;
};

// Calculate Predikat based on Nilai Akhir
export const calculatePredikat = (na: number): string => {
  if (na >= 90) return 'A (Sangat Baik)';
  if (na >= 80) return 'B (Baik)';
  if (na >= 70) return 'C (Cukup)';
  return 'D (Perlu Bimbingan)';
};

// Calculate Nilai Akhir (Formula: 20% TugasAvg + 20% UH + 30% UTS + 30% UAS)
export const calculateNilaiAkhir = (t1: number, t2: number, t3: number, uh: number, uts: number, uas: number): number => {
  const tugasAvg = (t1 + t2 + t3) / 3;
  const na = (tugasAvg * 0.20) + (uh * 0.20) + (uts * 0.30) + (uas * 0.30);
  return Math.round(na * 10) / 10;
};

export const generateDummyGrades = (): GradeRecord[] => {
  const grades: GradeRecord[] = [];
  const subjects = ['Matematika', 'Fisika', 'Bahasa Indonesia'];

  INITIAL_STUDENTS.forEach((student, index) => {
    subjects.forEach((subj, sIdx) => {
      const base = 75 + ((index * 3 + sIdx * 5) % 22);
      const t1 = Math.min(100, base + ((index % 4) - 2));
      const t2 = Math.min(100, base + ((index % 3) - 1));
      const t3 = Math.min(100, base + ((index % 5) - 2));
      const uh = Math.min(100, base + (sIdx % 3));
      const uts = Math.min(100, base - 2 + (index % 6));
      const uas = Math.min(100, base + 1 - (index % 4));

      const na = calculateNilaiAkhir(t1, t2, t3, uh, uts, uas);
      const predikat = calculatePredikat(na);

      grades.push({
        id: `grd-${student.id}-${subj}`,
        studentId: student.id,
        classId: student.classId,
        subject: subj,
        tugas1: t1,
        tugas2: t2,
        tugas3: t3,
        uh,
        uts,
        uas,
        nilaiAkhir: na,
        predikat,
      });
    });
  });

  return grades;
};

export const INITIAL_RPPS: RppItem[] = [
  {
    id: 'rpp-1',
    title: 'Modul Ajar: Sistem Persamaan Linear Dua Variabel (SPLDV)',
    mataPelajaran: 'Matematika',
    faseKelas: 'Fase E / Kelas X',
    elemen: 'Aljabar dan Fungsi',
    capaianPembelajaran: 'Peserta didik dapat menyelesaikan masalah yang berkaitan dengan sistem persamaan linear dua variabel dan sistem pertidaksamaan linear dua variabel secara kontekstual.',
    tujuanPembelajaran: '1. Peserta didik mampu memodelkan masalah kehidupan sehari-hari ke dalam SPLDV.\n2. Peserta didik mampu menyelesaikan SPLDV dengan metode eliminasi, substitusi, dan campuran.\n3. Peserta didik mampu menginterpretasikan solusi matematis dalam konteks masalah nyata.',
    alokasiWaktu: '2 JP x 45 Menit (1 Pertemuan)',
    kegiatanPendahuluan: '- Guru membuka pelajaran dengan salam dan doa bersama.\n- Aperpepsi: Mengaitkan materi SPLDV dengan harga belanja di kantin sekolah.\n- Menyampaikan tujuan pembelajaran dan cakupan penilaian.',
    kegiatanInti: '- Orientasi Siswa: Guru menyajikan lembar kasus kontekstual pembagian modal usaha.\n- Pengorganisasian Kelompok: Siswa dibagi menjadi kelompok heterogen berisi 4-5 orang.\n- Penyelidikan: Siswa berdiskusi memodelkan variabel x dan y serta menyelesaikan persamaan.\n- Presentasi: Kelompok perwakilan mempresentasikan hasil di papan tulis dan ditanggapi kelompok lain.',
    kegiatanPenutup: '- Peserta didik bersama guru menyimpulkan langkah-langkah penyelesaian SPLDV.\n- Refleksi pembelajaran melalui lembar emotikon pemahaman.\n- Pemberian tugas mandiri dan penutupan doa.',
    asesmen: '- Asesmen Formatif: Lembar Kerja Peserta Didik (LKPD) dan Observasi Sikap Gotong Royong.\n- Asesmen Sumatif: Kuis Singkat 2 Soal Uraian di akhir pertemuan.',
    mediaSumber: 'Buku Teks Matematika SMA Kelas X Kurikulum Merdeka, LKPD Cetak, Proyektor LCD, Papan Tulis.',
    createdAt: '2026-08-01',
  },
  {
    id: 'rpp-2',
    title: 'Modul Ajar: Struktur Atom & Tabel Periodik Unsur',
    mataPelajaran: 'Fisika / Kimia IPA',
    faseKelas: 'Fase E / Kelas X',
    elemen: 'Pemahaman IPA',
    capaianPembelajaran: 'Peserta didik memiliki kemampuan untuk memahami struktur atom, konfigurasi elektron, dan kaitannya dengan sifat-sifat keperiodikan unsur.',
    tujuanPembelajaran: '1. Mengidentifikasi partikel penyusun atom (proton, neutron, elektron).\n2. Menentukan konfigurasi elektron Bohr dan kuantum untuk unsur netral.\n3. Menjelaskan kecenderungan jari-jari atom dalam tabel periodik.',
    alokasiWaktu: '3 JP x 45 Menit',
    kegiatanPendahuluan: '- Guru menyapa dan mengecek kehadiran siswa.\n- Guru menunjukkan gambar kembang api dan menanyakan penyebab warna-warni kembang api.\n- Penyampaian alur aktivitas dan pembagian kelompok.',
    kegiatanInti: '- Simulasi Komputer: Siswa membuka phet interactive simulation model atom.\n- Eksplorasi: Siswa mencatat jumlah proton, neutron, dan elektron dari 10 unsur pertama.\n- Diskusi: Menganalisis hubungan jumlah elektron valensi dengan nomor golongan.',
    kegiatanPenutup: '- Guru memberikan umpan balik dan penguatan konsep partikel subatomik.\n- Post-test cepat via Kahoot / Lembar Kertas.\n- Salam penutup.',
    asesmen: '- Penilaian Kinerja Praktikum Simulasi.\n- Rubrik Diskusi Kelompok & Presentasi.',
    mediaSumber: 'PhET Interactive Simulations, Kartu Tabel Periodik Unsur, Slide PPT.',
    createdAt: '2026-08-03',
  },
];
