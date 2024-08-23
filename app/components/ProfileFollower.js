import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from '../StateContext';

function ProfileFollower() {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const { username } = useParams()
    const appState = useContext(StateContext)

    useEffect(() => {
        const cancelToken = Axios.CancelToken.source()
        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/followers`, { cancelToken: cancelToken.token })
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

    if (posts.length === 0) {
        if (appState.user.username === username) {
            return <p className="lead text-muted text-center">You don’t have any followers yet.</p>
        } else if (appState.user.username !== username) {
            return <p className="lead text-muted text-center">{username} doesn’t have any followers yet.</p>
        } else if (appState.loggedIn) {
            return <p className="lead text-muted text-center">This user doesn’t have any followers yet.</p>
        } else if (!appState.loggedIn) {
            ;<>
                {" "}
                If you want to follow them you need to <Link to="/">sign up</Link> for an account first.{" "}
            </>
        }
        return <p>This user has no followers yet.</p>
    } else {
        return (
            <div className="list-group">
                {posts.map((follower, index) => {
                    return (
                        <Link
                            key={index}
                            to={`/profile/${follower.username}`}
                            className="list-group-item list-group-item-action">
                            <img
                                className="avatar-tiny"
                                src="https://gravatar.com/avatar?s=128"
                            />{" "}
                            {follower.username}
                        </Link>
                    )
                })}
            </div>
        )
    }
}

export default ProfileFollower
