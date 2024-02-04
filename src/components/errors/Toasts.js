import React from "react";
import { Toast } from "react-bootstrap";
import { ToastContainer } from "react-bootstrap";

export default function Toasts({ alerts }) {

    return <>
            <ToastContainer>
                {alerts.map((alert) => {
                    <Toast bg={alert.variant.toLowercase()}> 
                        <Toast.Header>
                            <strong className="me-auto">{alert.title}</strong>
                            <small>11 mins ago</small>
                        </Toast.Header>
                        <Toast.Body className={variant === 'Dark' && 'text-white'}>
                            {alert.desc}
                        </Toast.Body>
                    </Toast>
                })}
            </ToastContainer>
        </>
}