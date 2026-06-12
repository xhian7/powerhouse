import type { Hono } from 'hono'
import type { HTMLBundle } from 'bun'

/**
 * Describes a single feature module of the application.
 *
 * A module is self-contained: it owns its API routes and its pages, and core
 * discovers it through the registry in `src/modules/index.ts`. Adding a module
 * never requires editing core.
 */
export type ModuleDefinition = {
    /** Unique module name, used for logging and debugging. */
    name: string
    /**
     * Base path the module's API is mounted under, e.g. `/home` results in
     * routes being available at `/api/home/*`. Required when `api` is set.
     */
    apiBasePath?: string
    /** A Hono router holding the module's API endpoints. */
    api?: Hono
    /**
     * Map of page URL -> Bun HTML bundle. These are served directly by
     * `Bun.serve` and are automatically bundled (including their `.tsx`
     * React islands) by Bun.
     */
    pages?: Record<string, HTMLBundle>
}

/**
 * Identity helper that gives a module definition its type and keeps module
 * files declarative. Use it as the default export of every module.
 */
export function defineModule(definition: ModuleDefinition): ModuleDefinition {
    return definition
}
