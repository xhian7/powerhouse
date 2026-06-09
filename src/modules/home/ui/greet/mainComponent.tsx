import { useEffect, useState } from 'react'
import { mountReactComponent } from '#core/ui/client/utils/mountReactComponent'

function ReactComponent() {
    const [greeting, setGreeting] = useState('from React')

    useEffect(() => {
        const timer = setTimeout(async () => {
            // Replace this with your actual API call
            const response = await fetch('/api/home/greet')
            const data = await response.text()
            setGreeting(data)
        }, 3000) // 3 seconds delay
        return () => clearTimeout(timer)
    }, [])

    return (
        <div>
            <h1>Hello, {greeting}!</h1>
        </div>
    )
}

mountReactComponent({ component: <ReactComponent />, elementId: 'home-greet' })