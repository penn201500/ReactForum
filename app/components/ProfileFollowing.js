import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"

function ProfileFollowing() {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const { username } = useParams()
    const appState = useContext(StateContext)

    useEffect(() => {
        const cancelToken = Axios.CancelToken.source()
        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/following`, { cancelToken: cancelToken.token })
                setPosts(response.data)
                setIsLoading(false)
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
            {posts.map((following, index) => {
                return (
                    <Link
                        key={index}
                        to={`/profile/${following.username}`}
                        className="list-group-item list-group-item-action">
                        <img
                            className="avatar-tiny"
                            src="https://gravatar.com/avatar?s=128"
                        />{" "}
                        {following.username}
                    </Link>
                )
            })}
            {posts.length === 0 && appState.user.username === username && <p className="lead text-muted text-center">You aren't following anyone yet.</p>}
            {posts.length === 0 && appState.user.username !== username && <p className="lead text-muted text-center">{username} isn't following anyone yet.</p>}
        </div>
    )
}

export default ProfileFollowing
