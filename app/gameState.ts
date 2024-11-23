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
  position: string;
};

// Define a type for the team logos
export type TeamLogo = {
  src: string;
  alt: string;
}

// define a type for hints
export type Hint = {
  logo: TeamLogo;
  years: string;
  position: string;
}

// Assert the type of playersData
const players: Player[] = playersData as Player[];
const allLogos = [...alLogos, ...nlLogos];

// Type for the current game state
type GameState = {
  selectedPlayer: Player | null;
  hints: Hint[];
  guessCount: number;
};

// Initialize the current game state
let currentGame: GameState = {
  selectedPlayer: null,
  hints: [],
  guessCount: 0
};

export type PlayerWithPosition = Player & { position: string };

// Randomly Select a Player
export function getRandomPlayer(): Player {
  const randomIndex = Math.floor(Math.random() * players.length);
  return players[randomIndex];
}

// Get all unique teams and positions a player has played for
function getPlayerTeams(player: Player): Player[] {
  return players.filter(p => p.playerName === player.playerName);
}

function getTeamLogo(teamName: string): TeamLogo | undefined {
  return allLogos.find(logo => logo.alt === teamName);
}

function getPlayerPositions(player: Player): string[] {
  return Array.from(new Set(players
    .filter(p => p.playerName === player.playerName)
    .map(p => p.position)));
}

// Get the next hint
export function getNextHint(): Hint | null {
  if (!currentGame.selectedPlayer) return null;
  
  const allTeams = getPlayerTeams(currentGame.selectedPlayer);
  const nextTeam = allTeams.find(team => !currentGame.hints.some(hint => hint.logo.alt === team.teamName));
  
  if (nextTeam) {
    const teamLogo = getTeamLogo(nextTeam.teamName);
    if (!teamLogo) return null;

    const hint: Hint = {
      logo: teamLogo,
      years: `${nextTeam.startYear}-${nextTeam.endYear}`,
      position: nextTeam.position
    };
    currentGame.hints.push(hint);
    return hint;
  }
  
  return null;
}

// Handle a guess
export function handleGuess(playerName: string): { correct: boolean; message: string; hints: Hint[]; guessCount: number } {
  currentGame.guessCount++;
  
  if (playerName === currentGame.selectedPlayer?.playerName) {
    return { correct: true, message: '', hints: currentGame.hints, guessCount: currentGame.guessCount };
  } else {
    const newHint = getNextHint();
    if (newHint) {
      return { correct: false, message: `Incorrect! Here's another hint:`, hints: currentGame.hints, guessCount: currentGame.guessCount };
    } else {
      return { correct: false, message: "No more hints available!", hints: currentGame.hints, guessCount: currentGame.guessCount };
    }
  }
}

// Start a new round
export function startNewRound(): { player: Player; firstHint: Hint | null } {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    currentGame.selectedPlayer = getRandomPlayer();
    currentGame.hints = [];
    currentGame.guessCount = 0;
    const firstHint = getNextHint();
    if (firstHint) {
      return { player: currentGame.selectedPlayer, firstHint };
    }
    attempts++;
  }

  // If we couldn't find a player with a valid hint after maxAttempts, return null
  return { player: currentGame.selectedPlayer!, firstHint: null };
}

// Get all player names (for search functionality)
export function getAllPlayerNames(): string[] {
  return Array.from(new Set(players.map(player => player.playerName)));
}

// Get player details by name
export function getPlayerByName(name: string): Player | undefined {
  return players.find(player => player.playerName.toLowerCase() === name.toLowerCase());
}

// Show player information when the player presses the who the hell is this button
export function revealCurrentPlayer(): PlayerWithPosition | null {
  if (currentGame.selectedPlayer) {
    return {
      ...currentGame.selectedPlayer,
      position: currentGame.selectedPlayer.position,
    };
  }
  return null;
}