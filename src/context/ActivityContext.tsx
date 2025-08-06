import { createContext, useContext, ReactNode } from 'react';

// Simple context for any shared state that might be needed
interface ActivityContextType {
  // Add any shared state here if needed in the future
}

// Create context
const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

// Custom hook to use the activity context
export function useActivities() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
}

interface ActivityProviderProps {
  children: ReactNode;
}

// Provider component
export function ActivityProvider({ children }: ActivityProviderProps) {
  // Context value - currently empty but can be extended
  const value: ActivityContextType = {
    // Add any shared state here if needed
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}
