interface VercelMinimalResponse {
  status: (code: number) => VercelMinimalResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

type MatchWinner = 'Universitario' | 'Alianza Lima' | 'Empate';

interface MatchItem {
  num: number;
  date: string;
  year: number;
  isFriendly: boolean;
  winner: MatchWinner;
  gU: number;
  gAli: number;
  raw: string;
}

function parseRsssf(rawHtmlOrText: string): MatchItem[] {
  let text = rawHtmlOrText;
  const preMatches = [...rawHtmlOrText.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/gi)];
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

export default async function handler(_req: unknown, res: VercelMinimalResponse) {
  const RSSSF_URL = 'https://www.rsssf.org/tablesa/aliuni.html';

  try {
    const response = await fetch(RSSSF_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      res.status(502);
      return res.json({ error: `RSSSF respondió con código ${response.status}` });
    }

    const html = await response.text();
    const data = parseRsssf(html);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
    res.status(200);
    return res.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido en la función';
    res.status(500);
    return res.json({ error: message });
  }
}