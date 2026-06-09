import { createContext, useContext } from 'react';
import type { Session } from '@supabase/supabase-js';

type SessionContextType = {
  session: Session | null;
  loading: boolean;
};

export const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
});

// create custom hook so other components can use it
export const useSession = () => useContext(SessionContext);
