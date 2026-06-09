import { Counter } from '#core/ui/client/counter'
import { mountReactComponent } from '#core/ui/client/utils/mountReactComponent'

function ReactComponent() {
    return (
        <div>
            <Counter />
        </div>
    )
}

mountReactComponent({ component: <ReactComponent />, elementId: 'home-root' })