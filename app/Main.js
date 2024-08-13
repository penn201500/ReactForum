import React from "react"
import { createRoot } from "react-dom/client"
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"

const root = createRoot(document.querySelector("#app"))

function Main() {
    return (
        <>
            <Header />
            <HomeGuest />
            <Footer />
        </>
    )
}

root.render(<Main />)
