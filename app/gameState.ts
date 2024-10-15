// gameState.ts

import playersData from '../public/players.json';
import { alLogos } from './alLogos';
import { nlLogos } from './nlLogos';

// Define a type for the player object
export type Player = {
  playerID: string;
  playerName: string;
  teamID: string;
  teamName: string;
  startYear: string;
  endYear: string;
};

// Define a type for the team logos
export type TeamLogo = {
  src: string;
  alt: string;
}

// Assert the type of playersData
const players: Player[] = playersData as Player[];
const allLogos = [...alLogos, ...nlLogos];

// Type for the current game state
type GameState = {
  selectedPlayer: Player | null;
  hints: { logo: TeamLogo; years: string }[];
  guessCount: number;
};

// Initialize the current game state
let currentGame: GameState = {
  selectedPlayer: null,
  hints: [],
  guessCount: 0
};

// Randomly Select a Player
export function getRandomPlayer(): Player {
  const randomIndex = Math.floor(Math.random() * players.length);
  return players[randomIndex];
}

// Get all unique teams a player has played for
function getPlayerTeams(player: Player): string[] {
  return Array.from(new Set(players
    .filter(p => p.playerName === player.playerName)
    .map(p => p.teamName)));
}

function getTeamLogo(teamName: string): TeamLogo | undefined {
  return allLogos.find(logo => logo.alt === teamName);
}

// Get the next hint
export function getNextHint(): { logo: TeamLogo; years: string } | null {
  if (!currentGame.selectedPlayer) return null;
  
  const allTeams = getPlayerTeams(currentGame.selectedPlayer);
  const nextTeam = allTeams.find(team => !currentGame.hints.some(hint => hint.logo.alt === team));
  
  if (nextTeam) {
    const teamLogo = getTeamLogo(nextTeam);
    if (!teamLogo) return null; // If no logo is found, return null instead of an incomplete hint

    const teamEntries = players.filter(p => p.playerName === currentGame.selectedPlayer!.playerName && p.teamName === nextTeam);
    const years = teamEntries.map(entry => `${entry.startYear}-${entry.endYear}`).join(', ');
    const hint = { logo: teamLogo, years };
    currentGame.hints.push(hint);
    return hint;
  }
  
  return null;
}

// Handle a guess
export function handleGuess(playerName: string): { correct: boolean; message: string; hints: { logo: TeamLogo; years: string }[] } {
  currentGame.guessCount++;
  
  if (playerName === currentGame.selectedPlayer?.playerName) {
    return { correct: true, message: `Correct! You guessed it in ${currentGame.guessCount} tries.`, hints: currentGame.hints };
  } else {
    const newHint = getNextHint();
    if (newHint) {
      return { correct: false, message: `Incorrect! Here's another hint:`, hints: currentGame.hints };
    } else {
      return { correct: false, message: "No more hints available!", hints: currentGame.hints };
    }
  }
}

// Start a new round
export function startNewRound(): { player: Player; firstHint: { logo: TeamLogo; years: string } | null } {
  currentGame.selectedPlayer = getRandomPlayer();
  currentGame.hints = [];
  currentGame.guessCount = 0;
  const firstHint = getNextHint();
  return { player: currentGame.selectedPlayer, firstHint };
}

// Get all player names (for search functionality)
export function getAllPlayerNames(): string[] {
  return Array.from(new Set(players.map(player => player.playerName)));
}

// Get player details by name
export function getPlayerByName(name: string): Player | undefined {
  return players.find(player => player.playerName.toLowerCase() === name.toLowerCase());
}