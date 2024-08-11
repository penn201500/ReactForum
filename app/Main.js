import React from "react"
import { createRoot } from "react-dom/client"

const root = createRoot(document.querySelector("#app"))

function ExampleComponent() {
    return (
        <div>
            <h1>Hello World</h1>
            <p>This is our app!</p>
        </div>
    )
}

root.render(<ExampleComponent />)
