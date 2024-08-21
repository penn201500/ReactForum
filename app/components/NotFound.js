import React from "react"
import Page from "./Page"
import { Link } from "react-router-dom"

function NotFound() {
    return (
        <Page title="Not Found">
            <div className="text-center">
                <h2>Whoops!</h2>
                <p className="lead text-muted">We cannot find that post.</p>
                <Link to="/">Back to Home</Link>
            </div>
        </Page>
    )
}

export default NotFound
