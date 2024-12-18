"use client";

import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { getAllPlayerNames, startNewRound, handleGuess, TeamLogo, getNextHint, revealCurrentPlayer, Hint } from './gameState';
import HeaderIcons from './headerIcons';
import { getSettings, toggleDarkMode, positionsToggle } from './navBarActions';

type PlayerWithPosition = {
  playerName: string;
  position: string;
};

export default function Component() {
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [hints, setHints] = useState<Hint[]>([]);
  const [message, setMessage] = useState<string>('');
  const [revealedPlayer, setRevealedPlayer] = useState<PlayerWithPosition | null>(null);
  const [correctGuess, setCorrectGuess] = useState<boolean>(false);
  const [guessCount, setGuessCount] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showPositions, setShowPositions] = useState<boolean>(true); // Set to true by default
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isPlayerRevealed, setIsPlayerRevealed] = useState<boolean>(false);
  
  useEffect(() => {
    const names = getAllPlayerNames();
    setPlayerNames(names);
    const { firstHint } = startNewRound();
    setHints(firstHint ? [firstHint] : []);

    const settings = getSettings();
    if (settings) {
      setDarkMode(settings.darkMode);
      setShowPositions(settings.positionsOn);
    }
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredSuggestions = playerNames.filter(name =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name);
    setSuggestions([]);
    const result = handleGuess(name);
    setGuessCount(result.guessCount);
    if (result.correct) {
      setCorrectGuess(true);
      setMessage('');
      setTimeout(() => {
        setCorrectGuess(false);
        setSearchTerm('');
        const { firstHint } = startNewRound();
        setHints(firstHint ? [firstHint] : []);
        setGuessCount(0);
      }, 2000);
    } else {
      setMessage(result.message);
      setHints(result.hints);
    }
  };

  const handleNewPlayer = () => {
    const { firstHint } = startNewRound();
    if (firstHint) {
      setHints([firstHint]);
      setMessage('');
    } else {
      setHints([]);
      setMessage('Unable to generate a hint. Please try again.');
    }
    setSearchTerm('');
    setRevealedPlayer(null);
    setCorrectGuess(false);
    setIsPlayerRevealed(false);
  };

  const regenerateHint = () => {
    const newHint = getNextHint();
    if (newHint) {
      setHints(prevHints => [...prevHints, newHint]);
      setMessage('');
    } else {
      setMessage('No more hints available for this player.');
    }
  };

  const handleWhotheHellisThis = () => {
    const player = revealCurrentPlayer();
    if (player) {
      setRevealedPlayer({
        playerName: player.playerName,
        position: player.position
      });
      setMessage(`The player was ${player.playerName} idiot`);
      setIsPlayerRevealed(true);
      setTimeout(() => {
        handleNewPlayer();
      }, 2000);
    } else {
      setMessage('Unable to reveal player. Starting a new round...');
      handleNewPlayer();
    }
  };

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = toggleDarkMode();
    setDarkMode(newDarkMode);
  };

  const handlePositionsToggle = () => {
    const newPositionsOn = positionsToggle();
    setShowPositions(newPositionsOn);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full row-start-1 flex justify-between items-center p-4 bg-gray-800">
        <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Team Player</div>
          <HeaderIcons onSettingsClick={handleSettingsToggle}/>
        </div>
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start justify-center w-full">
        <div className="w-full flex justify-center mb-4">
          <a className="px-4 py-2 rounded text-center font-bold">
            Guess the player based on the teams they played for
          </a>
        </div>
        <div className="w-full flex flex-col items-center justify-center text-center">
          {revealedPlayer ? !isPlayerRevealed && (
            <>
              <p className="text-2xl font-bold mb-4">{revealedPlayer.playerName}</p>
              {showPositions && (
                <p className="text-lg font-semibold">Position: {revealedPlayer.position}</p>
              )}
            </>
          ) : correctGuess ? (
            <p className="text-2xl font-bold mb-4 text-green-500">Correct!</p>
          ) : (
            <>
              {hints.length > 0 ? (
                hints.map((hint, index) => (
                  <div key={index} className="flex items-center justify-center mb-4">
                  <Image
                    src={hint.logo.src}
                    alt={hint.logo.alt}
                    width={80}
                    height={80}
                    className="mr-4"
                  />
                  <div>
                    <p>{hint.years}</p>
                    {showPositions && <p>Position: {hint.position}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p>No hints available. Try generating a new player.</p>
              )}
            </>
          )}
          <p className="mt-4 font-bold">{message}</p>
        </div>

        <div className="flex items-center justify-center p-4 w-full">
          <div className="relative w-full max-w-3xl">
            <input
              type="text"
              className="searchbar w-full h-12 pl-4 pr-20 text-sm text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white rounded-lg px-4 h-10 hover:bg-blue-500 focus:outline-none"
              type="button"
            >
              Search
            </button>

            {suggestions.length > 0 && (
              <ul className="absolute z-10 text-black w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                {suggestions
                  .filter(name => name.toLowerCase().startsWith(searchTerm.toLowerCase()))
                  .map((name, index) => (
                    <li 
                      key={index} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(name)}
                    >
                      {name}
                    </li>
                  ))
                }
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center w-full flex-col sm:flex-row text-white gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="rounded-full border bg-gray-800 border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              onClick={handleNewPlayer}
            >
              New Player
            </button>
            <button
              className="rounded-full border bg-gray-800 border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              onClick={regenerateHint}
            > 
              Generate New Hint
            </button>
            <button
              className="rounded-full border bg-gray-800 border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              onClick={handleWhotheHellisThis}
            >
              Who the Hell is This
            </button>
          </div>
        </div>
      </main>

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="darkMode"
                checked={darkMode}
                onChange={handleDarkModeToggle}
                className="mr-2"
              />
              <label htmlFor="darkMode">Dark Mode</label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showPositions"
                checked={showPositions}
                onChange={handlePositionsToggle}
                className="mr-2"
              />
              <label htmlFor="showPositions">Show Positions</label>
            </div>
            <button
              onClick={handleSettingsToggle}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/ronanwhite"
          target="_blank"
          rel="noopener noreferrer"
        >
          @ Ronan White 2024
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/rpwhite02"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
            alt="Github Icon"
            width={25}
            height={25}
          />
          Check out the project on Github
        </a>
      </footer>
    </div>
  );
}