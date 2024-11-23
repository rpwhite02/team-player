// Define types for each specific action
export type SettingsAction = {
    type: 'settings';
    darkMode: boolean;
    positionsOn: boolean;
};
  
export type StatsAction = {
    type: 'stats';
    gamesPlayed: number;
    winPercentage: number;
};
  
export type AboutAction = {
    type: 'about';
    version: string;
    description: string;
};
  
export type ShareAction = {
    type: 'share';
    url: string;
};
  
// Union type for all navbar actions
export type NavbarAction = SettingsAction | StatsAction | AboutAction | ShareAction;
  
// Type for the overall navbar state
export type NavbarState = {
    currentAction: NavbarAction | null;
    isOpen: boolean;
};
  
// Function to create a SettingsAction
export const createSettingsAction = (
    darkMode: boolean,
    positionsOn: boolean
    ): SettingsAction => ({
    type: 'settings',
    darkMode,
    positionsOn,
});
  
// Initial state
const initialNavbarState: NavbarState = {
    currentAction: createSettingsAction(false, false),
    isOpen: false,
};
  
// Current state
let currentState: NavbarState = { ...initialNavbarState };
  
export function positionsToggle(): boolean {
    if (currentState.currentAction && currentState.currentAction.type === 'settings') {
      const newPositionsOn = !currentState.currentAction.positionsOn;
      setCurrentAction(createSettingsAction(currentState.currentAction.darkMode, newPositionsOn));
      return newPositionsOn;
    }
    return false;
}
  
export function toggleDarkMode(): boolean {
    if (currentState.currentAction && currentState.currentAction.type === 'settings') {
      const newDarkMode = !currentState.currentAction.darkMode;
      setCurrentAction(createSettingsAction(newDarkMode, currentState.currentAction.positionsOn));
      return newDarkMode;
    }
    return false;
}
  
export function setCurrentAction(action: NavbarAction): void {
    currentState.currentAction = action;
}
  
export function getCurrentState(): NavbarState {
    return { ...currentState };
}
  
export function getSettings(): SettingsAction | null {
    return currentState.currentAction && currentState.currentAction.type === 'settings'
        ? { ...currentState.currentAction }
        : null;
}
  
export function toggleNavbar(): boolean {
    currentState.isOpen = !currentState.isOpen;
    return currentState.isOpen;
}
  
  // Functions for other action types can be added here as needed