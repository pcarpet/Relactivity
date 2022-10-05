import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import {useNavigate} from "react-router-dom"
import {Form, Button, Input, Modal } from "antd";

export default function SignUpModal() {
  
  const { modalState, toggleModals, signUp } = useContext(UserContext);

  const navigate = useNavigate();

  const handleForm = async (e) => {
    console.log(e);
    //e.preventDefault()


    if((e.pwd.length || e.repeatPwd.length) < 6) {
      console.log("6 characters min");
      return;
    }
    else if(e.pwd !== e.repeatPwd) {
      console.log("Passwords do not match")
      return;
    }

    try {

      await signUp(
        e.email,
        e.pwd
      )
      // formRef.current.reset();
      // console.log(cred);
      toggleModals("close")
      navigate("/private/private-home")

    } catch (err) {

      if(err.code === "auth/invalid-email") {
        console.log("Email format invalid")
      }
      
      if(err.code === "auth/email-already-in-use") {
        console.log("Email already used")
      }
 
    }

  }

  const closeModal = () => {
    toggleModals("close")
  }

  return (
    <>
      {modalState.signUpModal && (
        <Modal 
          //className="position-fixed top-0 vw-100 vh-100"
          onCancel={closeModal}
          open={true}
          footer={[
            <Button key="back" onClick={closeModal}>
               Annuler
            </Button>,
            <Button form="signUpForm" key="submit" type="primary" htmlType="submit">
                  Valider
            </Button>
          ]}
          >
          
                    <Form 
                    id="signUpForm"
                    //ref={formRef}
                    onFinish={handleForm}
                    className="sign-up-form">

                      <Form.Item
                        label="Adresse email"
                        name="email"
                        rules={[
                          { required: true, message: "Mail obligatoire" },
                        ]}
                      >
                        <Input type="email"  />
                      </Form.Item>

                      <Form.Item
                        label="Password"
                        name="pwd"
                        rules={[
                          { required: true, message: "Password obligatoire" },
                        ]}
                      >
                        <Input type="password"  />
                      </Form.Item>

                     <Form.Item
                        label="Repeat Password"
                        name="repeatPwd"
                        rules={[
                          { required: true, message: "Password Repeat obligatoire" },
                        ]}
                      >
                        <Input type="password"  />
                      </Form.Item>

                    </Form>
    
        </Modal>
      )}
    </>
  );
}