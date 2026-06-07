# Recipe App Parser

- My attempt to create my own online recipe parser to save online recipes and create my own collection for ease of access and use.

# Notes and refresher tips:

- Separation of concerns for backend:

1. Controllers: middleware logic
2. Routes: define endpoints
3. Services: Most of the real logic

# Client-side notes and to-do:

- Right now, just make a basic landing and form and display the data
- Creating the handle function and learned about encodeURIComponent so i can encode urls into a safe encoded version
- keeping display components decoupled from components that handle data
- presentation components vs. container components

Container components own state, fetch / store data, pass data + handlers down
Presentational components have no state and just render props. Emits events via callbacks.

## CSS (oh god)

-

# Side notes

- Normalizers take inconsistent, messy scraped data and convert it into predictable, clean formats

# To-DO

- Finish basic front end (done)

# Data persistance (CORE)

## important questions:

1. What happens when user clicks “save”?

- Take recipe from state
- Push it into savedRecipes
- Persist it (localStorage now, Supabase later)

2. What changes are user-owned vs backend-owned?

Currently, my backend generates the recipe object --> frontend receives it --> ui renders it
