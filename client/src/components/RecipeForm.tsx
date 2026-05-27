import { useState } from 'react';

export default function RecipeForm() {
  const [value, setValue] = useState('');
  const [recipe, setRecipe] = useState(null);

  const handleChange = (event) => {
    setValue(event.target.value);
    console.log(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!value) {
        alert('Please enter a valid link');
        return;
      }

      const response = await fetch(
        `http://localhost:4000/parse?url=${encodeURIComponent(value)}`,
      );
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className='recipe-form'>
      <input
        className='recipe-input'
        type='text'
        value={value}
        onChange={handleChange}
        placeholder='Paste a recipe URL'
      />
      <button className='recipe-button' onClick={handleSubmit}>
        Get Recipe
      </button>
      {recipe && <pre>{JSON.stringify(recipe, null, 2)}</pre>}
    </form>
  );
}
