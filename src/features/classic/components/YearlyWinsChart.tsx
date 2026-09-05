import { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Trophy } from 'lucide-react';
import type { YearStats } from '../types';

interface YearlyWinsChartProps {
  timeline: YearStats[];
}

type FilterOption = 'all' | 'last10' | 'last20' | '2020s' | '2010s' | '2000s' | '1990s' | '1980s' | 'older';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as YearStats;
    return (
      <div className="bg-[#0b1120] border border-slate-700 p-3 rounded-xl shadow-xl text-xs min-w-[140px]">
        <p className="font-bold text-slate-100 mb-2 border-b border-slate-700 pb-1 text-center">{label}</p>
        
        <div className="space-y-1">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex justify-between gap-4">
              <span style={{ color: entry.color }} className="font-medium">{entry.name}:</span>
              <span className="font-bold text-slate-200">{entry.value}</span>
            </div>
          ))}
        </div>
        
        {(data.gU_year > 0 || data.gAli_year > 0) && (
          <div className="mt-3 pt-2 border-t border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Diferencia de Goles</p>
            <div className="flex justify-between gap-4 text-xs font-semibold mb-1">
              <span className="text-amber-400/80">U: {data.gU_year}</span>
              <span className="text-blue-400/80">AL: {data.gAli_year}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Mejor:</span>
              <span className={`font-bold ${
                data.bestGoalDiffTeam === 'Universitario' ? 'text-amber-400' :
                data.bestGoalDiffTeam === 'Alianza Lima' ? 'text-blue-400' :
                'text-slate-300'
              }`}>
                {data.bestGoalDiffTeam}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const YearlyWinsChart = ({ timeline }: YearlyWinsChartProps) => {
  const [filter, setFilter] = useState<FilterOption>('all');

  const filteredTimeline = useMemo(() => {
    if (filter === 'all') return timeline;
    
    const currentYear = new Date().getFullYear();
    
    if (filter === 'last10') {
      return timeline.filter(t => t.year > currentYear - 10);
    }
    if (filter === 'last20') {
      return timeline.filter(t => t.year > currentYear - 20);
    }
    if (filter === '2020s') {
      return timeline.filter(t => t.year >= 2020 && t.year <= 2029);
    }
    if (filter === '2010s') {
      return timeline.filter(t => t.year >= 2010 && t.year <= 2019);
    }
    if (filter === '2000s') {
      return timeline.filter(t => t.year >= 2000 && t.year <= 2009);
    }
    if (filter === '1990s') {
      return timeline.filter(t => t.year >= 1990 && t.year <= 1999);
    }
    if (filter === '1980s') {
      return timeline.filter(t => t.year >= 1980 && t.year <= 1989);
    }
    if (filter === 'older') {
      return timeline.filter(t => t.year < 1980);
    }
    
    return timeline;
  }, [timeline, filter]);

  return (
    <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl backdrop-blur">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-slate-100">Distribución Anual de Clásicos</h2>
        </div>
        
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterOption)}
          className="bg-slate-800 border border-slate-700 text-xs text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-500"
        >
          <option value="all">Todos los años</option>
          <option value="last10">Últimos 10 años</option>
          <option value="last20">Últimos 20 años</option>
          <option value="2020s">Década 2020s</option>
          <option value="2010s">Década 2010s</option>
          <option value="2000s">Década 2000s</option>
          <option value="1990s">Década 1990s</option>
          <option value="1980s">Década 1980s</option>
          <option value="older">Antes de 1980</option>
        </select>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredTimeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
            <Tooltip 
              cursor={{ fill: '#1e293b', opacity: 0.8 }}
              content={<CustomTooltip />}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="ali_wins" name="Alianza Lima" fill="#1d4ed8" radius={[2, 2, 0, 0]} />
            <Bar dataKey="u_wins" name="Universitario" fill="#d97706" radius={[2, 2, 0, 0]} />
            <Bar dataKey="emp_wins" name="Empates" fill="#475569" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};