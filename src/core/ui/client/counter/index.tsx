import { useState } from 'react'
import './styles.css'

export function Counter(){
    const [count, setCount] = useState(0)
    return <div className="counter-container">
        <span className='counter-title'> The count is: {count} </span>
        <button onClick={() => setCount(count + 1)}> Increment </button>
    </div>
}