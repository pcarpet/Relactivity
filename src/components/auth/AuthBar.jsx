import React, { useContext } from 'react'
import { UserContext } from "./UserContext"
import { signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom'
import { auth } from "../../firebase.js";
import {  Button, Row, Col } from "antd";
import { LogoutOutlined, LoginOutlined } from "@ant-design/icons";


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

   
    const getSignInOrOutButton = () => {
        if(!currentUser){
            return( 
            <Button onClick={() => toggleModals("signIn")} className="hover-underline-animation">
                <LoginOutlined /> Connexion
            </Button>
            );
        }else{
            return(
                <Button onClick={logOut} className="hover-underline-animation" >
                    <LogoutOutlined />  Déconnexion
                </Button>
 
            );
        }
    }

    return(
        <Row>
            <Col span={6} className="appTitle"> RELACTITVITY </Col>
            <Col span={16}></Col>
            <Col span={2} style={{textAlign :'center'}}>
                {getSignInOrOutButton()}
            </Col>
        </Row>
        );

}

