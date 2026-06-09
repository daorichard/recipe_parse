import { Link } from 'react-router-dom';
import '../styles/nav.css';
import { supabase } from '@/supabaseClient';
import { useSession } from '@/context/sessionContext';
import { useNavigate } from 'react-router-dom';
export default function Nav() {
  const { session } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
  };

  const handleSignIn = () => {
    navigate('/Auth');
    return;
  };

  return (
    <nav className='nav'>
      <Link to='/'>Home</Link>
      <Link to='/Collection'>Collection</Link>
      {session ? (
        <button onClick={handleSignOut} className='sign-button'>
          Sign out
        </button>
      ) : (
        <button className='sign-button' onClick={handleSignIn}>
          Sign in
        </button>
      )}
    </nav>
  );
}
