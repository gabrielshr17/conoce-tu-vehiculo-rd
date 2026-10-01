import { useOutletContext } from 'react-router-dom';

export interface ShellContext {
  onSignOut: () => void;
}

export function useShell(): ShellContext {
  return useOutletContext<ShellContext>();
}
