import React from 'react';
import { Settings, BarChart2, HelpCircle, Share2 } from 'lucide-react';
import { toggleDarkMode, positionsToggle, getSettings } from './navBarActions';

interface IconButtonProps {
  Icon: React.ElementType;
  label: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 text-white hover:bg-gray-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
    aria-label={label}
  >
    <Icon className="h-6 w-6" />
  </button>
);

interface HeaderIconsProps {
  onSettingsClick: () => void;
}

export default function HeaderIcons({ onSettingsClick }: HeaderIconsProps) {
  const handleSettings = () => {
    const settings = getSettings();
    if (settings) {
      const newDarkMode = toggleDarkMode();
      const newPositionsOn = positionsToggle();
      console.log(`Dark mode is now ${newDarkMode ? 'on' : 'off'}`);
      console.log(`Positions are now ${newPositionsOn ? 'on' : 'off'}`);
    }
    onSettingsClick();
  };

  const handlePlayerStats = () => {
    console.log('Player Stats clicked');
    // Add your player stats logic here
  };

  const handleHowToPlay = () => {
    console.log('How to Play clicked');
    // Add your how to play logic here
  };

  const handleShare = () => {
    console.log('Share clicked');
    // Add your share logic here
  };

  return (
    <div className="flex space-x-4">
      <IconButton Icon={Settings} label="Settings" onClick={handleSettings} />
      <IconButton Icon={BarChart2} label="Player Stats" onClick={handlePlayerStats} />
      <IconButton Icon={HelpCircle} label="How to Play" onClick={handleHowToPlay} />
      <IconButton Icon={Share2} label="Share" onClick={handleShare} />
    </div>
  );
}