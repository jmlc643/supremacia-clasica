import type { VercelRequest, VercelResponse } from '@vercel/node';

type MatchWinner = 'Universitario' | 'Alianza Lima' | 'Empate';

interface MatchItem {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const RSSSF_URL = 'https://www.rsssf.org/tablesa/aliuni.html';
  try {
    const resp = await fetch(RSSSF_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!resp.ok) {
      return res.status(502).json({ error: `RSSSF respondió status ${resp.status}` });
    }

    const html = await resp.text();

    let text = html;
    const preMatches = [...html.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/gi)];
    if (preMatches.length > 0) {
      text = preMatches.map((m) => m[1]).join('\n');
    }

    const matches: MatchItem[] = [];
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

      let winner: MatchWinner;
      let gU = 0;
      let gAli = 0;

      let isWalkover = false;

      if ([7, 21, 352, 353].includes(num)) {
        winner = 'Alianza Lima';
        isWalkover = true;
      } else if (num === 128) {
        winner = 'Universitario';
        isWalkover = true;
      } else if (num === 207) {
        winner = 'Empate';
        isWalkover = true;
      } else {
        const scoreMatch = rest.match(
          /(Universitario|Alianza Lima)\s+(\d+)\s*-\s*(\d+)\s+(Universitario|Alianza Lima)/i
        );
        if (scoreMatch) {
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
        } else if (/wo/i.test(rest)) {
           isWalkover = true;
           if (/(Alianza Lima)\s+wo/i.test(rest)) winner = 'Alianza Lima';
           else if (/(Universitario)\s+wo/i.test(rest)) winner = 'Universitario';
           else winner = 'Empate';
        } else {
          continue;
        }
      }

      let competition = 'Desconocido';
      const noScorers = rest.split('[')[0];
      const scoreIndex = noScorers.search(/(?:\d+\s*-\s*\d+|wo)/i);
      
      if (/\bfriendly\b/i.test(rest)) {
        competition = 'Amistoso';
      } else if (scoreIndex !== -1) {
          let afterScore = noScorers.substring(scoreIndex).replace(/(?:\d+\s*-\s*\d+|wo)/i, '');
          afterScore = afterScore.replace(/(Universitario|Alianza Lima)/gi, '').trim();
          
          const inMatch = afterScore.match(/^in\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ\-\s]+?(?:\s{2,}|\t+)(.+)$/i);
          if (inMatch) {
             competition = inMatch[1].trim();
          } else {
             const words = afterScore.split(/\s+/);
             if (words.length > 2 && words[0].toLowerCase() === 'in') {
                competition = words.slice(2).join(' ').trim();
             } else {
                competition = afterScore;
             }
           }
      }
    
      competition = competition.replace(/\uFFFD/g, 'ó');
      competition = competition.replace(/<.*?/g, '');
      competition = competition.replace(/-+\s*Don.*?played.*/i, '');
      competition = competition.replace(/ó?Final/i, ' Final');
      competition = competition.replace(/\s+/g, ' ').trim();

      if (!competition) competition = 'Desconocido';

      matches.push({
        num,
        date: dateStr,
        year,
        competition,
        isWalkover,
        winner,
        gU,
        gAli,
        raw: line,
      });
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(matches);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error en endpoint';
    return res.status(500).json({ error: message });
  }
}
