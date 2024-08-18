import React, { useState, useReducer } from "react"
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
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

const root = createRoot(document.querySelector("#app"))

Axios.defaults.baseURL = "http://localhost:8080"

function Main() {
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("appToken")),
        flashMessages: [],
    }
    function appReducer(state, action) {
        switch (action.type) {
            case "login":
                return { loggedIn: true, flashMessages: state.flashMessages }
            case "logout":
                return { loggedIn: false, flashMessages: state.flashMessages }
            case "flashMessages":
                return { loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value) }
        }
    }
    const [state, dispatch] = useReducer(appReducer, initialState)

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages} />
                    <Header />
                    <Routes>
                        <Route
                            path="/"
                            element={state.loggedIn ? <Home /> : <HomeGuest />}
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
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

root.render(<Main />)
