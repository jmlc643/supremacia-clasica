import { Match, MatchWinner } from '../types';

export function parseRsssfRawText(rawHtmlOrText: string): Match[] {
  let text = rawHtmlOrText;
  const preMatches = [...rawHtmlOrText.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/gi)];
  if (preMatches.length > 0) {
    text = preMatches.map((m) => m[1]).join('\n');
  }

  const matches: Match[] = [];
  const lines = text.split('\n');

  for (let line of lines) {
    line = line.replace(/&nbsp;/g, ' ').replace(/\xa0/g, ' ').trim();
    if (!line || line.startsWith('No.') || line.startsWith('=')) continue;

    const m = line.match(/^(\d+)\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+(.+)$/);
    if (!m) continue;

    const num = parseInt(m[1], 10);
    const dateStr = m[2];
    const year = parseInt(dateStr.split('/')[2], 10);
    const rest = m[3];

    const isFriendly = /\bfriendly\b/i.test(rest);
    let winner: MatchWinner;
    let gU = 0;
    let gAli = 0;

    if ([7, 21, 352, 353].includes(num)) {
      winner = 'Alianza Lima';
    } else if (num === 128) {
      winner = 'Universitario';
    } else if (num === 207) {
      winner = 'Empate';
    } else {
      const scoreMatch = rest.match(
        /(Universitario|Alianza Lima)\s+(\d+)\s*-\s*(\d+)\s+(Universitario|Alianza Lima)/i
      );
      if (!scoreMatch) continue;

      const homeTeam = scoreMatch[1];
      const homeGoals = parseInt(scoreMatch[2], 10);
      const awayGoals = parseInt(scoreMatch[3], 10);

      if (/Universitario/i.test(homeTeam)) {
        gU = homeGoals;
        gAli = awayGoals;
      } else {
        gAli = homeGoals;
        gU = awayGoals;
      }

      if (gU > gAli) {
        winner = 'Universitario';
      } else if (gAli > gU) {
        winner = 'Alianza Lima';
      } else {
        winner = 'Empate';
      }
    }

    matches.push({
      num,
      date: dateStr,
      year,
      isFriendly,
      winner,
      gU,
      gAli,
      raw: line,
    });
  }

  return matches;
}