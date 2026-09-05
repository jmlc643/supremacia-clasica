export type MatchWinner = 'Universitario' | 'Alianza Lima' | 'Empate';

export interface Match {
  num: number;
  date: string;
  year: number;
  competition: string;
  isWalkover?: boolean;
  winner: MatchWinner;
  gU: number;
  gAli: number;
  raw: string;
}

export interface YearStats {
  year: number;
  u_wins: number;
  ali_wins: number;
  emp_wins: number;
  net_diff: number;
  cumU: number;
  cumAli: number;
  gU_year: number;
  gAli_year: number;
  bestGoalDiffTeam: MatchWinner | 'Empate' | 'Ninguno';
}

export interface CompetitionStats {
  name: string;
  total: number;
  totalU: number;
  totalAli: number;
  totalEmp: number;
  totalGoalsU: number;
  totalGoalsAli: number;
}

export interface ClassicStats {
  total: number;
  totalU: number;
  totalAli: number;
  totalEmp: number;
  totalGoalsU: number;
  totalGoalsAli: number;
  yearsAheadU: number;
  yearsAheadAli: number;
  yearsTied: number;
  timeline: YearStats[];
  dataset: Match[];
  competitions: CompetitionStats[];
}