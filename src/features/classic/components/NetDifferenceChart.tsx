import { ComponentProps } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { History } from 'lucide-react';
import { YearStats } from '../types';

interface NetDifferenceChartProps {
  timeline: YearStats[];
}

type TooltipFormatter = ComponentProps<typeof Tooltip>['formatter'];

export const NetDifferenceChart = ({ timeline }: NetDifferenceChartProps) => {
  const formatTooltipValue: TooltipFormatter = (value) => {
    const num = Number(value);
    return [`${num > 0 ? '+' : ''}${num} partidos`, 'Ventaja neta'];
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl backdrop-blur">
      <div className="flex items-center gap-2 mb-1">
        <History className="w-5 h-5 text-amber-400" />
        <h2 className="text-base font-bold text-slate-100">Diferencia Neta Histórica Acumulada</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">
        Curva calculada como (Victorias U - Victorias AL). Valores sobre cero representan liderazgo de Universitario; bajo cero, supremacía de Alianza Lima.
      </p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b1120',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={formatTooltipValue}
            />
            <Line type="monotone" dataKey="net_diff" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};