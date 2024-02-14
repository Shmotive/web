import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";



export default function Toasts({ alerts }) {
    const [showToast, setShowToast] = useState(true)

    const [visibleToasts, setVisibleToasts] = useState(alerts.reduce((acc, _, index) => {
        acc[index] = true; // Initialize all toasts as visible
        return acc;
    }, {}));

    const toggleShowToast = (index) => {
        setVisibleToasts(currentVisibleToasts => ({
            ...currentVisibleToasts,
            [index]: false, // Set the visibility of the clicked toast to false
        }));
    };

    return <ToastContainer 
                className="toasts-container">
                {alerts.map((alert, index) => {
                    return <Toast
                        key={index}
                        show={visibleToasts[index]}
                        onClose={() => toggleShowToast(index)}
                        autohide
                        delay={5000}
                        bg={alert.variant}> 
                        <Toast.Header>
                            <strong className="me-auto">{alert.title}</strong>
                            <small>11 mins ago</small>
                        </Toast.Header>
                        <Toast.Body className={alert.variant === "Dark" && 'text-white'}>
                            {alert.desc}
                        </Toast.Body>
                        </Toast>
                })}
                
            </ToastContainer>
}