import React, { useContext } from 'react'
import { UserContext } from "./components/auth/UserContext"
import { Outlet, Navigate } from "react-router-dom"

export default function Private()
{

    const { currentUser } = useContext(UserContext)
    console.log("PRIVATE", currentUser);

    if (!currentUser)
    {
        return <Navigate to="/" />
    }

    return (
        <div className="container">
            <Outlet />
        </div>
    )
}