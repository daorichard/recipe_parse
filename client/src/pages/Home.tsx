import '../components/RecipeForm';
import RecipeForm from '@/components/RecipeForm';
import Nav from '@/components/Nav';

export default function Home() {
  return (
    <div className='container'>
      <Nav></Nav>
      <section className='hero'>
        <h1>Save any recipe, instantly</h1>
        <p className='hero-subtitle'>
          Paste a link from your favorite recipe site and get a clean,
          easy-to-follow recipe in seconds.{' '}
        </p>
        <RecipeForm></RecipeForm>
      </section>
    </div>
  );
}
