import { useState, useEffect, useMemo } from 'react';
import type { Match, ClassicStats, YearStats } from '../types';
import { fetchClassicMatches } from '../services/classicService';

export function useClassicStats() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [includeFriendlies, setIncludeFriendlies] = useState<boolean>(false);
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

    const dataset = matches.filter((m) => (includeFriendlies ? true : !m.isFriendly));

    let totalU = 0;
    let totalAli = 0;
    let totalEmp = 0;
    let totalGoalsU = 0;
    let totalGoalsAli = 0;

    const yearMap: Record<number, { year: number; u: number; ali: number; emp: number }> = {};

    dataset.forEach((m) => {
      if (m.winner === 'Universitario') totalU++;
      else if (m.winner === 'Alianza Lima') totalAli++;
      else totalEmp++;

      totalGoalsU += m.gU;
      totalGoalsAli += m.gAli;

      if (!yearMap[m.year]) {
        yearMap[m.year] = { year: m.year, u: 0, ali: 0, emp: 0 };
      }
      if (m.winner === 'Universitario') yearMap[m.year].u++;
      else if (m.winner === 'Alianza Lima') yearMap[m.year].ali++;
      else yearMap[m.year].emp++;
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

      return {
        year: yr,
        u_wins: item.u,
        ali_wins: item.ali,
        emp_wins: item.emp,
        net_diff: cumU - cumAli,
        cumU,
        cumAli,
      };
    });

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
    };
  }, [matches, includeFriendlies]);

  return {
    stats,
    loading,
    error,
    includeFriendlies,
    setIncludeFriendlies,
  };
}