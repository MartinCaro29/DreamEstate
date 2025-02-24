import React from "react";
import { Modal, Button } from "react-bootstrap";

const MessageModal = ({ showMessageModal, handleCloseMessageModal, selectedMessage }) => {
    return (
        <Modal show={showMessageModal} onHide={handleCloseMessageModal}>
            <Modal.Header closeButton>
                <Modal.Title>Mesazhi i Përdoruesit</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedMessage && (
                    <div>
                        <h5>Emri: {selectedMessage.name}</h5>
                        <p><strong>Email:</strong> {selectedMessage.email}</p>
                        <p><strong>Telefoni:</strong> {selectedMessage.phone}</p>
                        <p><strong>Mesazhi:</strong></p>
                        <p>{selectedMessage.message}</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseMessageModal}>
                    Mbyll
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MessageModal;
