import '../components/RecipeForm';
import RecipeForm from '@/components/RecipeForm';
import Nav from '@/components/Nav';

export default function Home() {
  return (
    <div className='container'>
      <Nav></Nav>
      <h1>Enter Recipe URL here</h1>
      <RecipeForm></RecipeForm>
    </div>
  );
}
