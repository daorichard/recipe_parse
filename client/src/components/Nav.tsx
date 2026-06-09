import { Link } from 'react-router-dom';
import '../styles/nav.css';
import { supabase } from '@/supabaseClient';
import { useSession } from '@/context/sessionContext';

export default function Nav() {
  const session = useSession();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
  };
  return (
    <nav className='nav'>
      <Link to='/'>Home</Link>
      <Link to='/Collection'>Collection</Link>
      {session ? (
        <button onClick={handleSignOut}>Sign out</button>
      ) : (
        <button>Sign in</button>
      )}
    </nav>
  );
}
