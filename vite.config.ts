import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';

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

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-matches-dev-middleware',
      configureServer(server) {
        server.middlewares.use('/api/matches', async (_req, res) => {
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
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: `RSSSF respondió status ${resp.status}` }));
              return;
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

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(matches));
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error en endpoint';
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: message }));
          }
        });
      },
    },
  ],
});