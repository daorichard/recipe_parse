import { Link } from 'react-router-dom';
import '../styles/nav.css';

export default function Nav() {
  return (
    <nav className='nav'>
      <Link to='/'>Home</Link>
      <Link to='/Collection'>Collection</Link>
    </nav>
  );
}
