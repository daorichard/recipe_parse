import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Recipe from './pages/Recipe';
import Auth from './pages/Auth';
import './App.css';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { SessionContext, useSession } from './context/sessionContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

// ProtectedRoute — redirects to /auth if no session
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session } = useSession();
  if (!session) return <Navigate to='/auth' />;
  return <>{children}</>;
}

function App() {
  // store session data
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // fetch session data using Supabase API
  useEffect(() => {
    // Check if session already exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // listen for any auth changes after that
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // clean up when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  return (
    // pass the session state into the SessionContext provider
    <SessionContext.Provider value={{ session, loading }}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />} />
        <Route
          path='/Collection'
          element={
            <ProtectedRoute>
              <Collection />
            </ProtectedRoute>
          }
        />
        <Route path='/recipe' element={<Recipe />} />
      </Routes>
    </SessionContext.Provider>
  );
}

export default App;
