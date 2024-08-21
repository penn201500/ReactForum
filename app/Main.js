import { useEffect } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
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
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"

const root = createRoot(document.querySelector("#app"))

Axios.defaults.baseURL = "http://localhost:8080"

function Main() {
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("appToken")),
        flashMessages: [],
        user: {
            token: localStorage.getItem("appToken") || "",
            username: localStorage.getItem("appUser") || "",
        },
    }
    function appReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true
                draft.user = action.user  // update the user on login
                return
            case "logout":
                draft.loggedIn = false
                draft.user = {} // clear the user on logout
                return
            case "flashMessages":
                draft.flashMessages.push(action.value)
                return
        }
    }
    const [state, dispatch] = useImmerReducer(appReducer, initialState)

    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("appToken", state.user.token)
            localStorage.setItem("appUser", state.user.username)
        } else {
            localStorage.removeItem("appToken")
            localStorage.removeItem("appUser")
        }
    }, [state.loggedIn])

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
                        <Route
                            path="/profile/:username/*"
                            element={<Profile />}
                        />
                        <Route
                            path="/post/:id/edit"
                            element={<EditPost />}
                        />
                        <Route
                            path="*"
                            element={<NotFound />}
                        />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

root.render(<Main />)
