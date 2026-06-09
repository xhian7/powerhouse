import { type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

type mountReactComponentParams = {
    component: ReactNode
    elementId: string
    listenerAdded?: boolean
}

export function mountReactComponent({ component, elementId, listenerAdded = false }: mountReactComponentParams) {
    const existingRoot = document.getElementById(elementId)
    if (existingRoot && existingRoot.getAttribute('react-unmounted') !== null) {
        const root = createRoot(existingRoot)
        root.render(component)
        existingRoot.removeAttribute('react-unmounted')

        if (!listenerAdded) {
            document.body.addEventListener("htmx:afterSettle", () => {
                mountReactComponent({ component: component, elementId: elementId, listenerAdded: true })
            })
        }
    }
}