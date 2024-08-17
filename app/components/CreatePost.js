import React, { useEffect } from "react"
import Page from "./Page"
import Axios from "axios"

function CreatePost() {
    function handleSubmit(e) {
        e.preventDefault()
        try {
            Axios.post("http://localhost:8080/create-post", {
                title: e.target.title.value,
                body: e.target.body.value,
                token: localStorage.getItem("appToken"),
            }).then(response => {
                console.log("The post was created.")
            })
        } catch (error) {
            console.log("There was an error." + error)
        }
    }
    return (
        <Page title="Create New Post">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label
                        htmlFor="post-title"
                        className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        autoFocus
                        name="title"
                        id="post-title"
                        className="form-control form-control-lg form-control-title"
                        type="text"
                        placeholder=""
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label
                        htmlFor="post-body"
                        className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control"
                        type="text"></textarea>
                </div>

                <button className="btn btn-primary">Save New Post</button>
            </form>
        </Page>
    )
}

export default CreatePost
