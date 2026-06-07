import { useState } from 'react';
import '../styles/recipe_card.css';

type Recipe = {
  url: string;
  title: string;
  description: string;
  image?: string;
  prepTime: string;
  totalTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  cuisine: string[];
  category: string[];
  tags: string[];
};

type RecipeCardProps = {
  recipe: Recipe;
};

function cleanDomain(url: string) {
  const host = new URL(url).hostname;

  return host.replace(/^www\./, ''); // remove www.
}

function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className='recipe-card'>
      {/* Image */}
      <div className='recipe-top'>
        {recipe.image && (
          <img
            className='recipe-card__image'
            src={recipe.image}
            alt={recipe.title}
          />
        )}
        <div className='recipe-header'>
          <h1 className='recipe-card__title'>{recipe.title}</h1>
          <p className='recipe-url'>
            from <a href={recipe.url}>{cleanDomain(recipe.url)}</a>
          </p>
          <div className='recipe-card__meta'>
            <span>⏱ {recipe.totalTime}</span>
            <span>🍽 {recipe.servings} servings</span>
            <span>🔥 {recipe.prepTime} </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='recipe-card__content'>
        <div className='recipe-ingredients'>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className='recipe-instructions'>
          {Array.isArray(recipe.instructions) &&
            (recipe.instructions[0]?.type === 'section' ? (
              recipe.instructions.map((section, i) => (
                <div key={i} className='instructions'>
                  {section.name && <h2>{section.name}</h2>}
                  <ol>
                    {section.steps.map((step, j) => (
                      <li key={j}>{step}</li> // steps restart at 1 per section automatically
                    ))}
                  </ol>
                </div>
              ))
            ) : (
              <ol>
                {recipe.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ))}
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
