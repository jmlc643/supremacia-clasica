import type { CompetitionStats } from '../types';

interface CompetitionTableProps {
  competitions: CompetitionStats[];
}

export const CompetitionTable = ({ competitions }: CompetitionTableProps) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-base font-bold text-slate-100 mb-4">Estadísticas por Competición</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3">Competición</th>
              <th className="p-3 text-center">Partidos</th>
              <th className="p-3 text-center text-amber-300">Victorias U</th>
              <th className="p-3 text-center text-blue-400">Victorias AL</th>
              <th className="p-3 text-center text-slate-500">Empates</th>
              <th className="p-3 text-center text-amber-300">Goles U</th>
              <th className="p-3 text-center text-blue-400">Goles AL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {competitions.map((c) => (
              <tr key={c.name} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3 font-medium text-slate-200">{c.name}</td>
                <td className="p-3 text-center font-bold text-slate-300">{c.total}</td>
                <td className="p-3 text-center font-bold text-amber-300/80">{c.totalU}</td>
                <td className="p-3 text-center font-bold text-blue-400/80">{c.totalAli}</td>
                <td className="p-3 text-center text-slate-500">{c.totalEmp}</td>
                <td className="p-3 text-center text-amber-300/60">{c.totalGoalsU}</td>
                <td className="p-3 text-center text-blue-400/60">{c.totalGoalsAli}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
