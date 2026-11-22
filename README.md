# FocusBoard

FocusBoard is a responsive, single-user task dashboard built to the supplied frontend trainee assignment and Figma references. It demonstrates reusable React components, task CRUD, derived dashboard data, combined filters, browser persistence, and responsive layouts. No backend is required.

## Tech stack

- React 19
- Vite
- JavaScript
- Lucide React
- CSS

## Features

- Eight sample tasks (the assignment requires at least six), each with a unique ID, title, description, category, status, priority, and due date
- Create and edit task modal with required title validation
- Helpful title-validation error; description, category, status, priority, and optional due date fields
- Edit and delete actions, with confirmation before permanent deletion
- Immediate status updates for To do, In progress, and Completed
- Case-insensitive title search, status tabs, and priority filtering that work together
- Statistics derived from task data: total, in-progress, completed, and completion percentage
- Three-slide Focus Notes carousel with previous/next controls, slide indicators, and responsive layout
- `localStorage` persistence under `focusboard_tasks`; valid saved task arrays are restored on refresh
- Responsive dashboard layouts checked at 390 px, 768 px, and 1440 px
- Semantic controls, accessible labels, visible focus states, keyboard-accessible forms/navigation, and Escape-key dialog dismissal
- Sidebar navigation for Dashboard, My Tasks, Calendar, Filters, Help Center, and Settings; notification and profile popovers

## Assignment requirements checklist

| Requirement | Implementation |
| --- | --- |
| React project with reusable components | React + Vite; task form is a separate component |
| Sample task data | Eight varied tasks with all required fields |
| Create, edit, and delete | Task form, edit action, and delete confirmation |
| Status updates | Inline status selector and completion toggle |
| Search and filters | Case-insensitive title search, status tabs, and priority filter are combinable |
| Calculated statistics | Counts and completion percentage are derived from current tasks |
| Focus Notes carousel | Three manually navigable slides with synchronized indicators |
| Browser persistence | Tasks load from and save to localStorage |
| Accessibility | Labels, semantic controls, focus styling, and keyboard interactions |
| Responsive behavior | Desktop, tablet, mobile, and form layouts |
| No backend required | All task data stays in the current browser profile |

## State management

React hooks are used for state management. `useState` owns transient UI state such as search, filters, carousel position, and modal visibility. The `useLocalStorage` hook initializes the task source of truth from saved browser data (falling back to sample data when no valid saved array exists) and synchronizes task changes to storage. CRUD operations use immutable `map`, spread, and `filter` updates. Statistics and visible results are derived with `useMemo`, keeping cards, rows, counts, and filters consistent.

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

Run the project checks with:

```bash
npm run build
npm run lint
```

## Project structure

- `src/App.jsx` — application composition and task mutations
- `src/components/TaskForm.jsx` — create/edit form
- `src/data/sampleTasks.js` — initial task records
- `src/hooks/useLocalStorage.js` — safe storage hook
- `src/index.css` — responsive styles
- `screenshots/` — desktop and mobile previews

## Submission links

- Hosted application: [FocusBoard](https://focusboard-2cnc6bvf7-balaji7.vercel.app) (the provided deployment URL redirected to Vercel login when checked)
- Vercel project: [Deployment dashboard](https://vercel.com/balaji7/focusboard/GbdgbiJdFxwdvHD66S3RULBZwESD)
- GitHub repository: [RangannagariGuruBalaji/focusboard](https://github.com/RangannagariGuruBalaji/focusboard)

## Submission checklist

- [ ] Confirm the app URL is publicly accessible without a Vercel login.
- [x] Push the source and version history to a public GitHub repository and add its URL above.
- [x] Include this README, `AI_USAGE.md`, and desktop/mobile screenshots.
- [x] Record final live app and source URLs above.

## Additional UI and limitations

- Calendar is a local upcoming-task list, Help Center is in-app guidance, and Settings can restore the sample tasks. The profile is static demo content; these are not account or cloud services.
- Task data is local to the current origin and browser profile. It is not synchronized across devices or users.
- The app is frontend-only: there is no authentication, backend, cloud database, or task API.
