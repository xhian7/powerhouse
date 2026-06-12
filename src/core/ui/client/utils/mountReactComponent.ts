import { type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'

type Registration = {
    elementId: string
    component: ReactNode
}

/**
 * All React islands registered by the current page bundle. Keyed by element id
 * so re-registering the same island simply updates the component to render.
 */
const registrations = new Map<string, Registration>()
/** Live React roots, so we can re-render and clean them up correctly. */
const roots = new Map<string, Root>()
/** Ensures we only ever attach a single global HTMX listener per bundle. */
let listenerAttached = false

/**
 * Mounts (or re-mounts) every registered island whose target element is present
 * in the DOM and still marked `react-unmounted`, and unmounts roots whose
 * elements have been removed by an HTMX swap.
 */
function syncIslands() {
    for (const { elementId, component } of registrations.values()) {
        const element = document.getElementById(elementId)
        if (element && element.getAttribute('react-unmounted') !== null) {
            let root = roots.get(elementId)
            if (!root) {
                root = createRoot(element)
                roots.set(elementId, root)
            }
            root.render(component)
            element.removeAttribute('react-unmounted')
        }
    }

    // Drop roots whose host element was removed from the DOM (e.g. after an
    // HTMX swap navigated away) to avoid leaking detached React roots.
    for (const [elementId, root] of roots) {
        if (!document.getElementById(elementId)) {
            root.unmount()
            roots.delete(elementId)
        }
    }
}

type MountReactComponentParams = {
    component: ReactNode
    elementId: string
}

/**
 * Registers a React island and mounts it into `elementId`. The island is
 * automatically re-mounted whenever HTMX swaps the element back into the page.
 *
 * A single `htmx:afterSettle` listener is shared across all islands in the
 * bundle, so registering many islands does not leak listeners.
 */
export function mountReactComponent({ component, elementId }: MountReactComponentParams) {
    registrations.set(elementId, { elementId, component })

    if (!listenerAttached) {
        document.body.addEventListener('htmx:afterSettle', syncIslands)
        listenerAttached = true
    }

    syncIslands()
}