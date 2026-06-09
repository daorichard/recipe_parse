# Recipe App Parser

A personal project to build a recipe parser that saves online recipes into a structured, searchable collection for easy access and reuse.

---

# Backend Architecture Notes

## Separation of Concerns

- **Routes**: Define API endpoints
- **Controllers**: Handle request/response logic (middleware layer)
- **Services**: Core business logic

---

# Client-Side Notes

## MVP Scope

- Basic landing page
- Recipe input form
- Display parsed recipe data

---

## URL Handling

- Learned `encodeURIComponent`
- Used to safely encode recipe URLs before sending them to the backend

---

## Component Design Pattern

### Container vs Presentational Components

**Container Components**

- Manage state
- Fetch/store data
- Pass data and handlers to children

**Presentational Components**

- Pure UI
- No state
- Receive props and render UI
- Emit actions via callbacks

**Guiding Principle**

- Child components should generally render a single item or UI unit
- Parent components own state and data flow

---

# React Notes

- `children` is a special prop that represents nested JSX inside a component

---

# CSS Notes

- `flex` helps align items and distribute space
- Useful for keeping card layouts consistent in height and alignment

---

# Data Normalization

- Normalizers convert messy scraped recipe data into a consistent, structured format
- Helps ensure predictable backend responses

---

# Data Persistence Flow (Core)

## State Flow

- `useEffect`: Fetch session on load
- `useState`: Store local state
- `Context`: Share state across the application

## Context Behavior

- Components using `useSession()` subscribe to context updates
- Similar to a global state subscription model

---

# Key System Questions

## 1. What happens when a user clicks "Save"?

- Retrieve recipe from state
- Add to `savedRecipes`
- Persist data:
  - localStorage (current)
  - Supabase (future)

---

## 2. What is owned by the user vs backend?

**Backend**

- Generates recipe object

**Frontend**

- Receives recipe data
- Handles UI rendering and user interaction

---

# Supabase Authentication (Frontend)

- Supabase handles authentication and session management

## Session Contains

- User ID
- Email
- Authentication metadata

## Frontend Responsibilities

- Store session state
- Provide session via context
- React to authentication changes

---

# TODO

- Complete MVP frontend
- Improve UI structure and component separation
- Add persistent storage (Supabase integration)
