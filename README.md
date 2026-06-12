# PowerHouse

A small, opinionated framework for building **modular** web apps on top of
[Bun](https://bun.sh), [Hono](https://hono.dev),
[HTMX](https://htmx.org) and [React](https://react.dev).

The philosophy: cover the boring basics once (server, routing, layout, menu,
static assets, DB access) so you only ever focus on writing **modules**.

---

## Tech stack & why

| Layer            | Tech    | Role |
|------------------|---------|------|
| Runtime / bundler| **Bun** | Runs the server, bundles client `.tsx`, and serves HTML pages. |
| HTTP framework   | **Hono**| Handles the SSR shell, the JSON/HTML APIs and UI fragments. |
| Navigation / UI  | **HTMX**| Drives page navigation and partial updates with plain HTML attributes. |
| Interactivity    | **React** | Used as *islands* — only where real client-side state is needed. |
| Data             | **Bun SQL** (Postgres) | Used by the built-in menu. Optional for your modules. |

The result is a **server-first** app (fast first paint, little JS) that can drop
into full React interactivity exactly where you need it.

---

## Requirements

- [Bun](https://bun.sh) `1.x`
- A PostgreSQL database (the built-in menu persists to Postgres via Bun's `sql`).

Set your connection string before starting:

```sh
# PowerShell
$env:DATABASE_URL = "postgres://user:password@localhost:5432/powerhouse"

# bash/zsh
export DATABASE_URL="postgres://user:password@localhost:5432/powerhouse"
```

---

## Getting started

```sh
bun install
bun run dev      # starts the server with hot reload
```

On first run, the menu table is created and seeded automatically.

---

## How it works

PowerHouse runs **two cooperating layers** behind a single port:

```mermaid
flowchart LR
    Browser -->|/pages/*| Bun[Bun.serve<br/>HTML + client bundles]
    Browser -->|everything else| Hono[Hono app.fetch]
    Hono --> SSR["/ — SSR shell + menu"]
    Hono --> API["/api/* — module APIs"]
    Hono --> UI["/ui/* — HTMX fragments"]
    Hono --> Static["/public/* — static assets"]
```

1. **`Bun.serve` page routes** (`/pages/*`) — each page is an `index.html` that
   Bun bundles together with its `mainComponent.tsx` React island. These are
   collected automatically from every module.
2. **Hono `app.fetch`** handles everything else: the server-rendered shell at
   `/`, module APIs under `/api`, HTMX fragments under `/ui`, and static files
   under `/public`.

Navigation is HTMX: clicking a menu item issues an `hx-get` that swaps a page
into `#page-content`. When a page contains a React island, it re-mounts
automatically after the swap.

### Request lifecycle (clicking a menu item)

1. The shell loads the menu via `hx-get="/ui/menu/MainMenu"`.
2. A menu item has `hx-get="/pages/home"` targeting `#page-content`.
3. Bun serves the bundled page HTML + JS.
4. HTMX swaps it in and fires `htmx:afterSettle`.
5. `mountReactComponent` mounts/re-mounts any React island on the page.

---

## Project structure

```text
src/
  index.ts                 # Entry: builds Bun.serve page routes from the registry
  core/                    # Framework internals — you rarely touch these
    module.ts              # defineModule() + ModuleDefinition type
    api.ts                 # Root /api Hono router
    index.tsx              # Builds the Hono app, SSR shell, error handling
    ui/
      index.ts             # Root /ui router (UI fragments)
      client/              # Code that ships to the browser
        counter/           # Example reusable React component
        utils/mountReactComponent.ts
      server/
        htmlTemplate.tsx   # <html> document template
        menu/              # DB-backed, nested, HTMX-driven menu
  modules/
    index.ts               # THE MODULE REGISTRY — list your modules here
    home/                  # Example module
    settings/              # Example module (nested menu target)
public/                    # Static assets + global CSS
```

---

## Creating a module

A module is a self-contained folder under `src/modules/`. It owns its API and
its pages and is discovered through the registry — **you never edit core to add
one.**

### 1. Create the folder and a page

`src/modules/blog/ui/list/index.html`:

```html
<div class="page">
    <h1>Blog</h1>
    <button hx-get="/api/blog/hello" hx-target="#blog-output">Say hello</button>
    <pre id="blog-output" class="page-output"></pre>

    <!-- Optional React island: -->
    <div id="blog-root" react-unmounted></div>
    <script type="module" src="./mainComponent.tsx"></script>
</div>
```

> The `react-unmounted` attribute marks an element that an island should mount
> into. Omit the island `<div>` + `<script>` entirely for pure HTMX pages.

### 2. (Optional) Add a React island

`src/modules/blog/ui/list/mainComponent.tsx`:

```tsx
import { mountReactComponent } from '#core/ui/client/utils/mountReactComponent'

function ReactComponent() {
    return <p>Rendered by React.</p>
}

mountReactComponent({ component: <ReactComponent />, elementId: 'blog-root' })
```

### 3. Add an API

`src/modules/blog/api.ts`:

```ts
import { Hono } from 'hono'

export const blogApi = new Hono()
blogApi.get('/hello', (c) => c.text('Hello from the blog module!'))
```

### 4. Define the module

`src/modules/blog/index.ts`:

```ts
import { defineModule } from '#core/module'
import { blogApi } from './api'
import listPage from './ui/list/index.html'

export default defineModule({
    name: 'blog',
    apiBasePath: '/blog',          // mounted at /api/blog/*
    api: blogApi,
    pages: {
        '/pages/blog': listPage,   // served + bundled by Bun
    },
})
```

### 5. Register it

`src/modules/index.ts`:

```ts
import blog from './blog'

export const modules: ModuleDefinition[] = [home, settings, blog]
```

That's it — the API and pages are wired up automatically.

### 6. (Optional) Add it to the menu

The menu is data-driven and stored in Postgres. Add a row in
`seedMenuItems()` in [src/core/ui/server/menu/db.ts](src/core/ui/server/menu/db.ts):

```sql
('Blog', 'Blog', 'Go to the blog', '/pages/blog', 'MainMenu')
```

- `targetUrl = NULL` makes an item a **submenu parent** (expandable).
- A non-null `targetUrl` makes it a **link** that loads a page into
  `#page-content`.

---

## When to use HTMX vs React

| Use **HTMX** when…                              | Use a **React island** when…                  |
|-------------------------------------------------|-----------------------------------------------|
| Loading/swapping server-rendered HTML           | You need client-side state (e.g. a counter)   |
| Submitting forms, simple interactions           | Complex, highly interactive widgets           |
| You want minimal client JS                      | You need React's component model / ecosystem  |

React islands and HTMX coexist on the same page; islands automatically
re-mount after HTMX swaps via the shared `htmx:afterSettle` listener.

---

## Styling

- **Global / layout** styles live in `public/` (`styles.css`,
  `appLayout.css`).
- **Design tokens** (colors, spacing, radius) are CSS custom properties in
  `:root` in [public/styles.css](public/styles.css). Prefer tokens over
  hard-coded values so modules stay visually consistent.
- **Component styles** for React islands should be co-located and imported from
  the component (see [src/core/ui/client/counter/styles.css](src/core/ui/client/counter/styles.css)).
  For scoping, you can use `*.module.css` (Bun supports CSS Modules) so class
  names don't collide between modules.
- Avoid inline `style={{…}}` / `style="…"`; promote shared patterns to classes.

---

## Conventions & notes

- **Path aliases:** `#core/*` → `src/core/*`, `#modules/*` → `src/modules/*`.
- **Module isolation:** modules import from `#core/*`; core never imports a
  specific module — it only iterates the registry. This keeps the dependency
  graph acyclic.
- **Errors:** the Hono app has `notFound` and `onError` handlers; unhandled
  errors return `500` and are logged.
- **Security:** menu DB queries are parameterized. If menu data ever becomes
  user-editable, validate/whitelist `targetUrl` before rendering it into
  `hx-get`.