import { supabase } from '@/supabaseClient';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/sessionContext';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { session, loading } = useSession();

  if (loading) return null; // ← wait before deciding to redirect
  if (session) {
    navigate('/');
    return;
  }
  const handleSubmit = async () => {
    setError('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
      alert('Check your email to confirm!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      navigate('/Collection');
    }
  };

  return (
    <div className='container'>
      <h1>{isSignUp ? 'Create Account' : 'Sign in'}</h1>
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p>{error}</p>}

      <button onClick={handleSubmit}>{isSignUp ? 'Sign Up' : 'Sign in'}</button>

      {/* Toggle between sign in and sign up */}
      <p onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp
          ? 'Already have an account? Sign in'
          : "Don't have an account? Sign up"}
      </p>
    </div>
  );
}
