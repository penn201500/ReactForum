import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"

const root = createRoot(document.querySelector("#app"))

function Main() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={<HomeGuest />}
                />
                <Route
                    path="/about-us"
                    element={<About />}
                />
                <Route
                    path="/terms"
                    element={<Terms />}
                />
            </Routes>
            <Footer />
        </BrowserRouter>
    )
}

root.render(<Main />)
