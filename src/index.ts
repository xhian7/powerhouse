import { app } from '#core/index'
import { modules } from '#modules/index'

// Collect every module's pages into a single route map for Bun's static
// HTML serving + bundling. Anything not matched here falls through to Hono.
const pageRoutes = Object.assign({}, ...modules.map((module) => module.pages ?? {}))

const server = Bun.serve({
    routes: pageRoutes,
    fetch: app.fetch,
})

console.log(`Server running at ${server.url}`)