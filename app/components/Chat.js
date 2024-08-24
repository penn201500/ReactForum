import React, { useEffect, useContext, useRef } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer"
import io from "socket.io-client"
import { Link } from "react-router-dom"

const socket = io("http://localhost:8080")

function Chat() {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    const chatField = useRef(null)
    const [state, setState] = useImmer({
        fieldValue: "",
        chatMessages: [],
    })

    useEffect(() => {
        if (appState.isChatOpen) {
            chatField.current.focus()
        }
    }, [appState.isChatOpen])

    useEffect(() => {
        socket.on("chatFromServer", message => {
            setState(draft => {
                draft.chatMessages.push(message)
            })
        })
    }, [])

    function handleFieldChange(e) {
        e.preventDefault()
        setState(draft => {
            draft.fieldValue = e.target.value
        })
    }

    function handleSubmit(e) {
        e.preventDefault()

        socket.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token })

        setState(draft => {
            draft.chatMessages.push({ message: draft.fieldValue, username: appState.user.username, avatar: appState.user.avatar })
            draft.fieldValue = ""
        })
    }

    return (
        <div
            id="chat-wrapper"
            className={"chat-wrapper shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
            <div className="chat-title-bar bg-primary">
                Chat
                <span
                    onClick={() => appDispatch({ type: "closeChat" })}
                    className="chat-title-bar-close">
                    <i className="fas fa-times-circle"></i>
                </span>
            </div>
            <div
                id="chat"
                className="chat-log">
                {state.chatMessages.map((message, index) => {
                    if (message.username === appState.user.username) {
                        return (
                            <div
                                className="chat-self">
                                <div className="chat-message">
                                    <div className="chat-message-inner">{message.message}</div>
                                </div>
                                <img
                                    className="chat-avatar avatar-tiny"
                                    src={message.avatar}
                                />
                            </div>
                        )
                    }
                    return (
                        <div
                            className="chat-other">
                            <Link to={`/profile/${message.username}`}>
                                <img
                                    className="avatar-tiny"
                                    src={message.avatar}
                                />
                            </Link>
                            <div className="chat-message">
                                <div className="chat-message-inner">
                                    <Link to={`/profile/${message.username}`}>
                                        <strong>{message.username}: </strong>
                                    </Link>
                                    {message.message}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <form
                id="chatForm"
                className="chat-form border-top"
                onSubmit={handleSubmit}>
                <input
                    value={state.fieldValue}
                    onChange={handleFieldChange}
                    ref={chatField}
                    type="text"
                    className="chat-field"
                    id="chatField"
                    placeholder="Type a message…"
                    autoComplete="off"
                />
            </form>
        </div>
    )
}

export default Chat
