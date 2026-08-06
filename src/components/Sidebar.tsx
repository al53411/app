import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileSpreadsheet, 
  BookOpen, 
  Link as LinkIcon, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  RefreshCw
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const menuItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: 'Data Siswa & Kelas', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: 'Rekap Absensi', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'grades', label: 'Penilaian & Leger', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'rpp', label: 'Perangkat Ajar / RPP', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'integration', label: 'Integrasi Data', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'settings', label: 'Pengaturan Sekolah', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside
      id="app-sidebar"
      className={`bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col z-30 flex-shrink-0 ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* BRANDING HEADER */}
      <div className="p-5 mb-1 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-lg text-white tracking-tight leading-none">
                SIM-GURU
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1 truncate">
                Admin Panel v2.1
              </span>
            </div>
          )}
        </div>

        <button
          id="btn-collapse-sidebar"
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-lg transition-colors ml-1"
          title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={isActive ? 'text-white' : 'text-slate-400'}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER USER / SYNC ACTION */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
        {!isCollapsed && (
          <button
            onClick={() => onSelectTab('integration')}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs py-2 px-3 rounded-lg border border-slate-700 font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sync Data</span>
          </button>
        )}

        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[11px] flex-shrink-0">
            AM
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-semibold text-white truncate">Guru Pengampu</p>
              <p className="text-[10px] text-slate-400 truncate">Status: Online</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

