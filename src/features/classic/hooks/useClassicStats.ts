import { useState, useEffect, useMemo } from 'react';
import type { Match, ClassicStats, YearStats, CompetitionStats, MatchWinner } from '../types';
import { fetchClassicMatches } from '../services/classicService';

export function useClassicStats() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [competitionFilter, setCompetitionFilter] = useState<string>('Oficiales');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClassicMatches()
      .then(setMatches)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo<ClassicStats | null>(() => {
    if (!matches.length) return null;

    const dataset = matches.filter((m) => {
      if (competitionFilter === 'All') return true;
      if (competitionFilter === 'Oficiales') return m.competition !== 'Amistoso';
      if (competitionFilter === 'Amistosos') return m.competition === 'Amistoso';
      return m.competition === competitionFilter;
    });

    let totalU = 0;
    let totalAli = 0;
    let totalEmp = 0;
    let totalGoalsU = 0;
    let totalGoalsAli = 0;

    const yearMap: Record<number, { year: number; u: number; ali: number; emp: number; gu: number; gali: number }> = {};
    const compMap: Record<string, CompetitionStats> = {};

    dataset.forEach((m) => {
      if (m.winner === 'Universitario') totalU++;
      else if (m.winner === 'Alianza Lima') totalAli++;
      else totalEmp++;

      totalGoalsU += m.gU;
      totalGoalsAli += m.gAli;

      if (!yearMap[m.year]) {
        yearMap[m.year] = { year: m.year, u: 0, ali: 0, emp: 0, gu: 0, gali: 0 };
      }
      if (m.winner === 'Universitario') yearMap[m.year].u++;
      else if (m.winner === 'Alianza Lima') yearMap[m.year].ali++;
      else yearMap[m.year].emp++;
      
      yearMap[m.year].gu += m.gU;
      yearMap[m.year].gali += m.gAli;

      if (!compMap[m.competition]) {
        compMap[m.competition] = { name: m.competition, total: 0, totalU: 0, totalAli: 0, totalEmp: 0, totalGoalsU: 0, totalGoalsAli: 0 };
      }
      compMap[m.competition].total++;
      if (m.winner === 'Universitario') compMap[m.competition].totalU++;
      else if (m.winner === 'Alianza Lima') compMap[m.competition].totalAli++;
      else compMap[m.competition].totalEmp++;
      compMap[m.competition].totalGoalsU += m.gU;
      compMap[m.competition].totalGoalsAli += m.gAli;
    });

    const sortedYears = Object.keys(yearMap).map(Number).sort((a, b) => a - b);
    let cumU = 0;
    let cumAli = 0;
    let yearsAheadU = 0;
    let yearsAheadAli = 0;
    let yearsTied = 0;

    const timeline: YearStats[] = sortedYears.map((yr) => {
      const item = yearMap[yr];
      cumU += item.u;
      cumAli += item.ali;

      if (cumU > cumAli) yearsAheadU++;
      else if (cumAli > cumU) yearsAheadAli++;
      else yearsTied++;

      let bestGoalDiffTeam: MatchWinner | 'Empate' | 'Ninguno' = 'Ninguno';
      if (item.gu > item.gali) bestGoalDiffTeam = 'Universitario';
      else if (item.gali > item.gu) bestGoalDiffTeam = 'Alianza Lima';
      else if (item.gu === item.gali && (item.gu > 0 || item.gali > 0)) bestGoalDiffTeam = 'Empate';

      return {
        year: yr,
        u_wins: item.u,
        ali_wins: item.ali,
        emp_wins: item.emp,
        net_diff: cumU - cumAli,
        cumU,
        cumAli,
        gU_year: item.gu,
        gAli_year: item.gali,
        bestGoalDiffTeam,
      };
    });

    const competitions = Object.values(compMap).sort((a, b) => b.total - a.total);

    return {
      total: dataset.length,
      totalU,
      totalAli,
      totalEmp,
      totalGoalsU,
      totalGoalsAli,
      yearsAheadU,
      yearsAheadAli,
      yearsTied,
      timeline,
      dataset,
      competitions
    };
  }, [matches, competitionFilter]);

  const availableCompetitions = useMemo(() => {
    const s = new Set<string>();
    matches.forEach(m => {
      if (m.competition !== 'Amistoso') s.add(m.competition);
    });
    return Array.from(s).sort();
  }, [matches]);

  return {
    stats,
    loading,
    error,
    competitionFilter,
    setCompetitionFilter,
    availableCompetitions
  };
}