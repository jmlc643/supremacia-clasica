import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#04070e] py-8 text-[11px] text-slate-400">
      <div className="max-w-7xl mx-auto px-6 space-y-2.5">
        <p className="font-semibold text-slate-300">
          Fuente de datos:{' '}
          <a
            href="https://www.rsssf.org/tablesa/aliuni.html"
            target="_blank"
            rel="noreferrer"
            className="text-amber-400 hover:underline"
          >
            RSSSF (The Rec.Sport.Soccer Statistics Foundation)
          </a>
          .
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>W.O. y Resoluciones Administrativas:</strong> Se computan 5 partidos bajo fallo oficial: 4 a favor de Alianza Lima (#7, #21, #352 y #353) y 1 a favor de Universitario (#128 de Libertadores 1966 tras fallo de CONMEBOL).
          </li>
          <li>
            <strong>Partido de desempate de 1985 (#207):</strong> Se computa formalmente como empate reglamentario (0-0), considerando que las tandas de penales no alteran el resultado del partido en el historial general según estándares FIFA/RSSSF.
          </li>
        </ul>
      </div>
    </footer>
  );
};