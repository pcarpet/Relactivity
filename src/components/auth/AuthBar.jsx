import React, { useContext } from 'react'
import { UserContext } from "./UserContext"
import { signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom'
import { auth } from "../../firebase.js";
import {  Button } from "antd";

export default function AuthBar()
{

    const { toggleModals, currentUser } = useContext(UserContext)

    const navigate = useNavigate()

    const logOut = async () =>
    {
        try
        {
            await signOut(auth)
            navigate("/")
        } catch {
            alert("For some reasons we can't deconnect, please check your internet connexion and retry.")
        }
    }

    return (
       
            <div>
                <Button
                    onClick={() => toggleModals("signIn")}
                    className="btn btn-primary ms-2">
                    Sign In
                </Button>
                <Button
                    onClick={logOut}
                    className="btn btn-danger ms-2">
                    Log Out
                </Button>
                {currentUser.uid}
            </div>
    
    )
}