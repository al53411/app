import React, { useState } from 'react';
import { 
  Link as LinkIcon, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Copy, 
  Check,
  FileText
} from 'lucide-react';
import { Student, ClassRoom } from '../types';

interface GoogleSheetsIntegrationProps {
  students: Student[];
  classes: ClassRoom[];
  selectedClassId: string;
  onSyncStudents: (importedStudents: Student[]) => void;
}

export const GoogleSheetsIntegration: React.FC<GoogleSheetsIntegrationProps> = ({
  students,
  classes,
  selectedClassId,
  onSyncStudents,
}) => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [csvRawInput, setCsvRawInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const sampleCsvData = `NISN,NIS,Nama Lengkap,Gender,Tempat Lahir,Tanggal Lahir,Nama Ortu,No HP Ortu,Alamat
0085551101,26201,Dimas Anggara,L,Jakarta,2010-04-12,Budi Anggara,0812-9988-7766,Jl. Mangga No. 10
0085551102,26202,Elvira Rose,P,Bandung,2010-06-25,Rudi Rose,0812-8877-6655,Jl. Melati No. 44
0085551103,26203,Fajar Sadboy,L,Gorontalo,2010-11-14,Rizal,0812-7766-5544,Jl. Kenanga No. 15`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(sampleCsvData);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const parseCsvText = (text: string): Student[] => {
    const lines = text.trim().split('\n').filter((l) => l.trim() !== '');
    if (lines.length < 2) return [];

    const parsed: Student[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      if (cols.length >= 3) {
        parsed.push({
          id: `std-gsheet-${Date.now()}-${i}`,
          classId: selectedClassId,
          nisn: cols[0] || `008${Date.now()}${i}`,
          nis: cols[1] || `${26200 + i}`,
          name: cols[2] || `Siswa Impor ${i}`,
          gender: cols[3]?.toUpperCase() === 'P' ? 'P' : 'L',
          birthPlace: cols[4] || 'Bandung',
          birthDate: cols[5] || '2010-01-01',
          parentName: cols[6] || 'Wali Siswa',
          parentPhone: cols[7] || '0812-0000-1111',
          address: cols[8] || '',
        });
      }
    }
    return parsed;
  };

  const handleSyncFromUrl = async () => {
    if (!sheetUrl) {
      setSyncMessage({ type: 'error', text: 'Masukkan URL Google Sheets terlebih dahulu!' });
      return;
    }

    setIsLoading(true);
    setSyncMessage(null);

    try {
      let fetchUrl = sheetUrl;
      // Convert standard sheet URL to CSV export format if Google Sheets link provided
      if (sheetUrl.includes('docs.google.com/spreadsheets')) {
        const matches = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (matches && matches[1]) {
          const docId = matches[1];
          fetchUrl = `https://docs.google.com/spreadsheets/d/${docId}/export?format=csv`;
        }
      }

      const res = await fetch(fetchUrl);
      if (!res.ok) {
        throw new Error('Gagal menarik data dari URL. Pastikan link dipublikasikan untuk umum.');
      }
      const text = await res.text();
      const parsedStudents = parseCsvText(text);

      if (parsedStudents.length === 0) {
        throw new Error('Format CSV tidak valid atau tidak ada baris data siswa.');
      }

      onSyncStudents(parsedStudents);
      setSyncMessage({
        type: 'success',
        text: `Berhasil sinkronisasi ${parsedStudents.length} data siswa dari Google Sheets!`,
      });
    } catch (err: any) {
      setSyncMessage({
        type: 'error',
        text: err.message || 'Gagal terhubung dengan Google Sheets.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFromRawCsv = () => {
    if (!csvRawInput.trim()) {
      setSyncMessage({ type: 'error', text: 'Masukkan teks CSV terlebih dahulu!' });
      return;
    }

    const parsed = parseCsvText(csvRawInput);
    if (parsed.length === 0) {
      setSyncMessage({ type: 'error', text: 'Format teks CSV tidak valid.' });
      return;
    }

    onSyncStudents(parsed);
    setSyncMessage({
      type: 'success',
      text: `Berhasil mengimpor ${parsed.length} data siswa secara manual!`,
    });
    setCsvRawInput('');
  };

  const handleLoadSampleData = () => {
    setCsvRawInput(sampleCsvData);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
            <LinkIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Integrasi Data & Google Sheets
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Tarik data siswa secara otomatis dari spreadsheet publik atau impor berkas CSV
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
          <span>Target Kelas Sync:</span>
          <span className="text-indigo-600 font-bold">
            {classes.find((c) => c.id === selectedClassId)?.name || 'X IPA 1'}
          </span>
        </div>
      </div>

      {/* SYNC NOTIFICATION ALERT */}
      {syncMessage && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-semibold ${
            syncMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {syncMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <div>{syncMessage.text}</div>
        </div>
      )}

      {/* SECTION 1: GOOGLE SHEETS URL INTEGRATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base text-slate-800">
            1. Sinkronisasi via Link Google Sheets / CSV Publik
          </h3>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Masukkan Link Google Sheets (File &gt; Bagikan &gt; Dipublikasikan di Web):
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              id="input-gsheet-url"
              placeholder="https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 font-mono text-slate-800"
            />
            <button
              id="btn-sync-gsheet"
              onClick={handleSyncFromUrl}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 flex-shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Menarik Data...' : 'Sync Data Sekarang'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500">
            *Pastikan Google Sheets telah diset agar siapa saja yang memiliki link dapat melihat.
          </p>
        </div>
      </div>

      {/* SECTION 2: MANUAL CSV PASTE & IMPOR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-800">
              2. Impor Data via Teks CSV / Salin-Tempel (Paste)
            </h3>
          </div>
          <button
            onClick={handleLoadSampleData}
            className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
          >
            Muat Sampel CSV DUMMY
          </button>
        </div>

        <div className="space-y-3">
          <textarea
            rows={5}
            placeholder="Tempelkan baris CSV di sini (NISN, NIS, Nama Lengkap, Gender, Tempat Lahir, Tanggal Lahir, Nama Ortu, No HP, Alamat)..."
            value={csvRawInput}
            onChange={(e) => setCsvRawInput(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
          />

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleCopyTemplate}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-medium"
            >
              {copiedTemplate ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedTemplate ? 'Format Disalin!' : 'Salin Template CSV'}</span>
            </button>

            <button
              id="btn-import-raw-csv"
              onClick={handleSyncFromRawCsv}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Proses Impor CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
