import type { ClassicStats } from '../types';

interface KpiCardsProps {
  stats: ClassicStats;
}

export const KpiCards = ({ stats }: KpiCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-[#0b172e]/90 border border-blue-900/60 p-5 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Alianza Lima</div>
        <div className="text-3xl font-black text-blue-100 mt-1">{stats.totalAli}</div>
        <p className="text-xs text-slate-400 mt-1">{stats.totalGoalsAli} goles registrados</p>
        <div className="absolute right-3 top-3 text-4xl font-black text-blue-900/20 select-none">AL</div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Empates</div>
        <div className="text-3xl font-black text-slate-200 mt-1">{stats.totalEmp}</div>
        <p className="text-xs text-slate-500 mt-1">{stats.total} encuentros jugados</p>
      </div>

      <div className="bg-[#210c11]/90 border border-amber-900/50 p-5 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="text-xs font-bold uppercase tracking-wider text-[#f4ebd0]">Universitario</div>
        <div className="text-3xl font-black text-amber-100 mt-1">{stats.totalU}</div>
        <p className="text-xs text-slate-400 mt-1">{stats.totalGoalsU} goles registrados</p>
        <div className="absolute right-3 top-3 text-4xl font-black text-amber-900/20 select-none">U</div>
      </div>

      <div className="bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl shadow-lg">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Años Arriba</div>
        <div className="text-lg font-bold text-slate-100 mt-2 flex items-baseline justify-between">
          <span className="text-blue-400">{stats.yearsAheadAli} <span className="text-xs text-slate-500">AL</span></span>
          <span className="text-xs text-slate-600">vs</span>
          <span className="text-amber-200">{stats.yearsAheadU} <span className="text-xs text-slate-500">U</span></span>
        </div>
        <p className="text-xs text-slate-500 mt-1">{stats.yearsTied} años en tablas</p>
      </div>
    </div>
  );
};