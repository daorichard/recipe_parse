import { supabase } from '@/supabaseClient';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/sessionContext';
import '../styles/auth.css';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { session, loading } = useSession();

  if (loading) return null;
  if (session) {
    navigate('/');
    return null;
  }

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setSubmitting(false);
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
        setSubmitting(false);
        return;
      }
      navigate('/Collection');
    }

    setSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        {/* Hero image */}
        <div className='auth-hero'>
          <img
            src='https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt=''
            aria-hidden='true'
          />
        </div>

        {/* Form */}
        <div className='auth-body'>
          <h1>{isSignUp ? 'Sign up' : 'Login'}</h1>

          <div className='auth-fields'>
            {/* Email */}
            <div className='auth-input-wrap'>
              <svg
                className='auth-icon'
                viewBox='0 0 20 20'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'>
                <rect x='2' y='5' width='16' height='12' rx='2' />
                <path d='M2 7l8 5 8-5' />
              </svg>
              <input
                type='email'
                placeholder='Email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete='email'
              />
            </div>

            {/* Password */}
            <div className='auth-input-wrap'>
              <svg
                className='auth-icon'
                viewBox='0 0 20 20'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'>
                <rect x='5' y='9' width='10' height='8' rx='1.5' />
                <path d='M7 9V6.5a3 3 0 0 1 6 0V9' />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
              <button
                className='auth-eye'
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? (
                  <svg
                    viewBox='0 0 20 20'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.5'>
                    <path d='M3 3l14 14M8.5 8.6A3 3 0 0 0 11.4 11.5M6.1 6.2C4.3 7.3 2.9 8.9 2 10c1.7 2.4 4.6 5 8 5a8 8 0 0 0 3.9-1.1M10 5c3.4 0 6.3 2.6 8 5a13 13 0 0 1-1.7 2.3' />
                  </svg>
                ) : (
                  <svg
                    viewBox='0 0 20 20'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.5'>
                    <path d='M2 10c1.7-2.4 4.6-5 8-5s6.3 2.6 8 5c-1.7 2.4-4.6 5-8 5s-6.3-2.6-8-5z' />
                    <circle cx='10' cy='10' r='2.5' />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <p className='auth-error'>{error}</p>}

          <button
            className='auth-submit'
            onClick={handleSubmit}
            disabled={submitting}>
            {submitting ? 'Please wait…' : 'Continue'}
          </button>

          <button
            className='auth-toggle'
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span>{isSignUp ? 'Sign in' : 'Create an account'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
