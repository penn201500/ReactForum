import React, { useState } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Axios from "axios"
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/Home"
import CreatePost from "./components/CreatePost"
import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"
import CommonContext from "./CommonContext"

const root = createRoot(document.querySelector("#app"))

Axios.defaults.baseURL = "http://localhost:8080"

function Main() {
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("appToken") ? true : false)
    const [flashMessages, setFlashMessages] = useState([])

    function addFlashMessage(msg) {
        setFlashMessages(prev => prev.concat(msg))
    }

    return (
        <CommonContext.Provider value={addFlashMessage}>
            <BrowserRouter>
                <FlashMessages messages={flashMessages} />
                <Header
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                />
                <Routes>
                    <Route
                        path="/"
                        element={loggedIn ? <Home /> : <HomeGuest />}
                    />
                    <Route
                        path="/about-us"
                        element={<About />}
                    />
                    <Route
                        path="/terms"
                        element={<Terms />}
                    />
                    <Route
                        path="/create-post"
                        element={<CreatePost />}
                    />
                    <Route
                        path="/post/:id"
                        element={<ViewSinglePost />}
                    />
                </Routes>
                <Footer />
            </BrowserRouter>
        </CommonContext.Provider>
    )
}

root.render(<Main />)
