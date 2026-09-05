import { useState } from 'react';
import type { Match } from '../types';

interface MatchTableProps {
  dataset: Match[];
}

export const MatchTable = ({ dataset }: MatchTableProps) => {
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const filtered = dataset.filter(
    (m) =>
      m.date.includes(search) ||
      m.year.toString().includes(search) ||
      m.winner.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-base font-bold text-slate-100">Explorador de Partidos</h2>
        <input
          type="text"
          placeholder="Buscar por año o ganador..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-slate-800 border border-slate-700 text-xs text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-500 w-full sm:w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Goles U</th>
              <th className="p-3">Goles AL</th>
              <th className="p-3">Ganador</th>
              <th className="p-3">Tipo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pageItems.map((m) => (
              <tr key={m.num} className="hover:bg-slate-800/40">
                <td className="p-3 text-slate-500">{m.num}</td>
                <td className="p-3 font-medium text-slate-200">{m.date}</td>
                <td className="p-3 font-bold text-amber-300">{m.gU}</td>
                <td className="p-3 font-bold text-blue-400">{m.gAli}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      m.winner === 'Universitario'
                        ? 'bg-amber-950 text-amber-200 border border-amber-800'
                        : m.winner === 'Alianza Lima'
                        ? 'bg-blue-950 text-blue-200 border border-blue-800'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {m.winner}
                  </span>
                </td>
                <td className="p-3 text-slate-500">{m.isFriendly ? 'Amistoso' : 'Oficial'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-xs text-slate-400">
        <span>
          Página {currentPage} de {totalPages} ({filtered.length} partidos)
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded"
          >
            Anterior
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};