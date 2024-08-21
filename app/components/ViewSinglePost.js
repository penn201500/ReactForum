import React, { useEffect, useState, useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import { Tooltip } from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from '../StateContext';

function ViewSinglePost() {
    const [isLoading, setIsLoading] = useState(true)
    const [post, setPost] = useState()
    const { id } = useParams()
    const appState = useContext(StateContext)

    useEffect(() => {
        const cancelToken = Axios.CancelToken.source()
        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`, { cancelToken: cancelToken.token })
                setPost(response.data)
                setIsLoading(false)
            } catch (error) {
                console.log("There was a problem." + error)
            }
        }
        fetchPost()
        return () => {
            cancelToken.cancel()
        }
    }, [])

    if (!isLoading && !post) {
        return <NotFound />
    }

    if (isLoading) {
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        )
    }

    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    const allowedElements = ["p", "strong", "em", "a", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code"]

    function isOwner() {
        if (appState.loggedIn) {
            return appState.user.username === post.author.username
        }
        return false
    }

    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>
                {isOwner() && (
                    <span className="pt-2">
                        <Link
                            to={`/post/${post._id}/edit`}
                            data-tooltip-content="Edit"
                            data-tooltip-id="edit"
                            className="text-primary mr-2">
                            <i className="fas fa-edit"></i>
                        </Link>
                        <Tooltip
                            id="edit"
                            className="custom-tooltip"
                        />{" "}
                        <a
                            data-tooltip-content="Delete"
                            data-tooltip-id="delete"
                            className="delete-post-button text-danger">
                            <i className="fas fa-trash"></i>
                            <Tooltip
                                id="delete"
                                className="custom-tooltip"
                            />
                        </a>
                    </span>
                )}
            </div>

            <p className="text-muted small mb-4">
                <Link to={`/profile/${post.author.username}`}>
                    <img
                        className="avatar-tiny"
                        src="https://gravatar.com/avatar?s=128"
                    />
                </Link>
                Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> {dateFormatted}
            </p>

            <div className="body-content">
                <ReactMarkdown
                    children={post.body}
                    rehypePlugins={[[rehypeSanitize, { tagNames: allowedElements }]]}
                />
            </div>
        </Page>
    )
}

export default ViewSinglePost
