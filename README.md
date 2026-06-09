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

\*child components are to only be used to render ONE item
Parent component holds the state and data and can pass on anything the child needs.
--> container vs presentational pattern

## react notes

- children: special prop means whatever is nested inside this component

## CSS (oh god)

- flex: stretches to fill whatever height is left after so all cards end at the same point

# Side notes

- Normalizers take inconsistent, messy scraped data and convert it into predictable, clean formats

# To-DO

- Finish basic front end (done)

# Data persistance (CORE)

useEffect → goes and gets the session
useState → stores it
Context → broadcasts it to the rest of the app

## important questions:

1. What happens when user clicks “save”?

- Take recipe from state
- Push it into savedRecipes
- Persist it (localStorage now, Supabase later)

2. What changes are user-owned vs backend-owned?

Currently, my backend generates the recipe object --> frontend receives it --> ui renders it

# Supabase auth for frontend

- Frontend + supabase will handle user sessions
- Session consists of user's auth data that supabase return. (user's id, email, password)
