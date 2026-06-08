import '../components/RecipeForm';
import RecipeForm from '@/components/RecipeForm';

export default function Home() {
  return (
    <div className='container'>
      <h1>Enter Recipe URL here</h1>
      <RecipeForm></RecipeForm>
    </div>
  );
}
