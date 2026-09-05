import { useClassicStats } from './features/classic/hooks/useClassicStats';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { KpiCards } from './features/classic/components/KPICards';
import { NetDifferenceChart } from './features/classic/components/NetDifferenceChart';
import { YearlyWinsChart } from './features/classic/components/YearlyWinsChart';
import { MatchTable } from './features/classic/components/MatchTable';
import { Database, ShieldAlert } from 'lucide-react';

export default function App() {
  const { stats, loading, error, includeFriendlies, setIncludeFriendlies } = useClassicStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050914] text-slate-200 flex flex-col items-center justify-center gap-3 font-sans">
        <Database className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-sm tracking-wide">Cargando base de datos histórica...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-[#050914] text-red-400 flex flex-col items-center justify-center p-4 font-sans">
        <ShieldAlert className="w-10 h-10 mb-2" />
        <p className="text-base font-bold">Error de carga</p>
        <p className="text-xs text-slate-400 mt-1 max-w-md text-center">{error || 'Sin datos'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060e1d] via-[#081326] to-[#120709] text-slate-100 flex flex-col justify-between font-sans">
      <Header
        includeFriendlies={includeFriendlies}
        onToggleFriendlies={setIncludeFriendlies}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
        <KpiCards stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NetDifferenceChart timeline={stats.timeline} />
          <YearlyWinsChart timeline={stats.timeline} />
        </div>
        <MatchTable dataset={stats.dataset} />
      </main>

      <Footer />
    </div>
  );
}