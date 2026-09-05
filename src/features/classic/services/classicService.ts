import type { Match } from '../types';

const CACHE_KEY = 'dataclasico_matches_cache_v3';

export async function fetchClassicMatches(): Promise<Match[]> {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as Match[];
    } catch {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  const response = await fetch('/api/matches');
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudieron obtener los datos.`);
  }

  const data: Match[] = await response.json();
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  return data;
}