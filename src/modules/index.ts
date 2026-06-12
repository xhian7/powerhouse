import type { ModuleDefinition } from '#core/module'
import home from './home'
import settings from './settings'

/**
 * The single source of truth for every feature module in the app.
 *
 * To add a module: create a folder under `src/modules/`, export a
 * `defineModule({ ... })` default from its `index.ts`, then add it to this
 * array. Core wires up its API routes and pages automatically — no other file
 * needs to change.
 */
export const modules: ModuleDefinition[] = [home, settings]
