import logoAlianza from '../assets/escudo_alianza_lima.webp';
import logoU from '../assets/escudo_universitario.webp';

interface HeaderProps {
  competitionFilter: string;
  onFilterChange: (val: string) => void;
  availableCompetitions: string[];
}

export const Header = ({ competitionFilter, onFilterChange, availableCompetitions }: HeaderProps) => {
  return (
    <header className="border-b border-slate-800 bg-[#060c18]/90 backdrop-blur sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <img src={logoAlianza} alt="Escudo Alianza Lima" className="w-9 h-9 drop-shadow-md" />
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider bg-gradient-to-r from-blue-400 via-slate-200 to-[#e4d6a7] bg-clip-text text-transparent">
              DataClásico
            </h1>
            <p className="text-[11px] text-slate-400">Historial Comparativo Alianza Lima vs. Universitario</p>
          </div>
          <img src={logoU} alt="Escudo Universitario" className="w-9 h-9 drop-shadow-md" />
        </div>

        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 px-3.5 py-1.5 rounded-xl">
          <span className="text-xs font-medium text-slate-300">Filtro:</span>
          <select 
            value={competitionFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-xs text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-500 min-w-[140px]"
          >
            <option value="All">Todas las competiciones</option>
            <option value="Oficiales">Solo Oficiales</option>
            <option value="Amistosos">Solo Amistosos</option>
            <optgroup label="Específicas">
              {availableCompetitions.map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>
    </header>
  );
};