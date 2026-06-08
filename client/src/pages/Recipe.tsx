import RecipeCard from '@/components/RecipeCard';
import { useSearchParams } from 'react-router-dom';
import Nav from '@/components/Nav';
export default function RecipePage() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  const saved = JSON.parse(localStorage.getItem('recipes') || '[]');
  const recipe = saved.find((r) => r.url === url);

  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div className='container'>
      <Nav></Nav>
      <RecipeCard recipe={recipe} onSave={() => {}} />
    </div>
  );
}
