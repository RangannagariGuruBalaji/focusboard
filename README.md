# FocusBoard

FocusBoard is a responsive frontend task dashboard built for the trainee assignment. It provides task CRUD, status updates, combined search and filters, dynamic statistics, a three-slide Focus Notes carousel, local persistence, and accessible keyboard-friendly controls.

## Tech stack

- React 19
- Vite
- JavaScript
- Lucide React
- CSS

## Features

- Eight sample tasks with unique IDs and varied categories, statuses, priorities, and due dates
- Create and edit task modal with title and due-date validation
- Delete confirmation
- Immediate status updates
- Case-insensitive title search
- Status tabs combined with priority filtering
- Derived total, in-progress, completed, and completion percentage statistics
- Three-slide manual carousel with circular previous/next controls and indicators
- `localStorage` persistence under `focusboard_tasks`
- Responsive desktop, tablet, and mobile layouts
- Semantic controls, labels, focus states, and accessible dialogs

## State management

React hooks are used for state management. `useState` owns UI state such as search, filters, carousel position, and modal visibility. `useLocalStorage` owns the persisted task source of truth and synchronizes task mutations to browser storage. CRUD operations use immutable `map`, spread, and `filter` updates; statistics and visible results are derived with `useMemo`.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
npm run preview
```

## Project structure

- `src/App.jsx` — application composition and task mutations
- `src/components/TaskForm.jsx` — create/edit form
- `src/data/sampleTasks.js` — initial task records
- `src/hooks/useLocalStorage.js` — safe storage hook
- `src/index.css` — responsive styles
- `screenshots/` — desktop and mobile previews

## Submission links

- Hosted URL: _Add the deployed HTTPS URL here_
- GitHub repository: _Add the public repository URL here_

## Known limitations

The sidebar's Calendar, Filters, Help Center, and Settings items are visual placeholders. Calendar and settings screens are outside the stated assessment scope. Browser persistence is local to the current origin and browser profile.
