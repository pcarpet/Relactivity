import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import {Form, Button, Input, Modal } from "antd";

export default function SignInModal() {
  
  const { modalState, toggleModals, signIn } = useContext(UserContext);

  const navigate = useNavigate();



  const handleForm = async (e) => {
    //e.preventDefault();
    console.log(e);
    try {
      await signIn(
        e.email,
        e.pwd
      );
      // à tester
      // formRef.current.reset();
      // console.log(cred);
      toggleModals("close");
      navigate("/private/private-home");
    } catch {
      console.log("Wopsy, email and/or password incorrect")
    }
  };

  const closeModal = () => {
    toggleModals("close");
  };

  return (
    <>
      {modalState.signInModal && (
        <Modal 
          //className="position-fixed top-0 vw-100 vh-100"
          onCancel={closeModal}
          open={true}
          footer={[
            <Button key="back" onClick={closeModal}>
               Annuler
            </Button>,
            <Button form="signInForm" key="submit" type="primary" htmlType="submit">
                  Valider
            </Button>
          ]}
          >
          
            <Form 
            id="signInForm"
            //ref={formRef}
            onFinish={handleForm}
            className="sign-in-form"
            layout="vertical"
            >

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

            </Form>
    
        </Modal>
      )}
    </>
  );
}