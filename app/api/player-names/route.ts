import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get('playerName'); // Get the player name from query params

  try {
    const filePath = path.join(process.cwd(), 'public', 'data.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    if (searchQuery) {
      // If a specific player is searched, return their full stats
      const playerStats = records.find((record: any) => record.playerName.toLowerCase() === searchQuery.toLowerCase());
      if (playerStats) {
        return NextResponse.json(playerStats);
      } else {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 });
      }
    } else {
      // Return all player names as before
      const playerNamesMap: { [key: string]: boolean } = {};
      records.forEach((record: any) => {
        if (record.playerName) {
          playerNamesMap[record.playerName] = true;
        }
      });

      const playerNames = Object.keys(playerNamesMap);
      return NextResponse.json(playerNames);
    }
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}