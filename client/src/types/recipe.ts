export type Recipe = {
  url: string;
  title: string;
  description: string;
  image?: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  cuisine: string[];
  category: string[];
  tags: string[];
};
