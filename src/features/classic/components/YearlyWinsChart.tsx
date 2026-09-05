import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Trophy } from 'lucide-react';
import type { YearStats } from '../types';

interface YearlyWinsChartProps {
  timeline: YearStats[];
}

export const YearlyWinsChart = ({ timeline }: YearlyWinsChartProps) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl backdrop-blur">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-blue-400" />
        <h2 className="text-base font-bold text-slate-100">Distribución Anual de Clásicos</h2>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: '#0b1120', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="ali_wins" name="Alianza Lima" fill="#1d4ed8" radius={[2, 2, 0, 0]} />
            <Bar dataKey="u_wins" name="Universitario" fill="#d97706" radius={[2, 2, 0, 0]} />
            <Bar dataKey="emp_wins" name="Empates" fill="#475569" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};