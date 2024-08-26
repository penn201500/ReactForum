import { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import { CSSTransition } from "react-transition-group"
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
import Search from "./components/Search"
import Chat from "./components/Chat"

const root = createRoot(document.querySelector("#app"))

Axios.defaults.baseURL = "http://localhost:8080"

function Main() {
    const searchRef = useRef(null)
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("appToken")),
        flashMessages: [],
        user: {
            token: localStorage.getItem("appToken") || "",
            username: localStorage.getItem("appUser") || "",
            avatar: localStorage.getItem("avatar") || "",
        },
        isSearchOpen: false,
        isChatOpen: false,
        unreadChatCount: 0,
    }
    function appReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true
                draft.user = action.user // update the user on login
                return
            case "logout":
                draft.loggedIn = false
                draft.user = {} // clear the user on logout
                return
            case "flashMessages":
                draft.flashMessages.push(action.value)
                return
            case "openSearch":
                draft.isSearchOpen = true
                return
            case "closeSearch":
                draft.isSearchOpen = false
                return
            case "toggleChat":
                draft.isChatOpen = !draft.isChatOpen
                return
            case "closeChat":
                draft.isChatOpen = false
                return
            case "incrementUnreadChatCount":
                draft.unreadChatCount++
                return
            case "clearUnreadChatCount":
                draft.unreadChatCount = 0
                return
        }
    }
    const [state, dispatch] = useImmerReducer(appReducer, initialState)

    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("appToken", state.user.token)
            localStorage.setItem("appUser", state.user.username)
            localStorage.setItem("avatar", state.user.avatar)
        } else {
            localStorage.removeItem("appToken")
            localStorage.removeItem("appUser")
            localStorage.removeItem("avatar")
        }
    }, [state.loggedIn])

    useEffect(() => {
        if (state.loggedIn) {
            const ourRequest = Axios.CancelToken.source()
            async function fetchResults() {
                try {
                    const response = await Axios.post("checkToken", { token: state.user.token }, { cancelToken: ourRequest.token })
                    if (!response.data) {
                        dispatch({ type: "logout" })
                        dispatch({ type: "flashMessages", value: "Token has expired. Please log in again." })
                    }
                } catch (error) {
                    console.log("There was a problem." + error)
                }
            }
            fetchResults()
            return () => ourRequest.cancel()
        }
    }, [])

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
                    <Chat />
                    <Footer />
                    <CSSTransition
                        nodeRef={searchRef}
                        timeout={330}
                        in={state.isSearchOpen}
                        classNames="search-overlay"
                        unmountOnExit>
                        <Search ref={searchRef} />
                    </CSSTransition>
                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

root.render(<Main />)
