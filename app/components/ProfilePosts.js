import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"

function ProfilePosts() {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const { username } = useParams()

    useEffect(() => {
        const cancelToken = Axios.CancelToken.source()
        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: cancelToken.token })
                if (response.data) {
                    setPosts(response.data)
                    setIsLoading(false)
                } else {
                    throw new Error(`The url profile/${username}/posts is invalid.`)
                }
            } catch (error) {
                console.log("There was a problem." + error)
            }
        }

        fetchPosts()
        return () => {
            cancelToken.cancel()
        }
    }, [username])

    if (isLoading) {
        return <LoadingDotsIcon />
    }
    return (
        <div className="list-group">
            {posts.map(post => {
                const date = new Date(post.createdDate)
                const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
                return (
                    <Link
                        key={post._id}
                        to={`/post/${post._id}`}
                        className="list-group-item list-group-item-action">
                        <img
                            className="avatar-tiny"
                            src="https://gravatar.com/avatar?s=128"
                        />{" "}
                        <strong>{post.title}</strong> <span className="text-muted small">on {dateFormatted} </span>
                    </Link>
                )
            })}
        </div>
    )
}

export default ProfilePosts
