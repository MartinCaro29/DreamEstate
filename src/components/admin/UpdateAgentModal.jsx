// AgentModal.jsx
import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AgentModal = ({ 
  showUpdateAgentModal, 
  handleCloseUpdateAgentModal, 
  editAgentForm, 
  setEditAgentForm, 
  handleAgentUpdate 
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <Modal show={showUpdateAgentModal} onHide={handleCloseUpdateAgentModal}>
      <Modal.Header closeButton>
        <Modal.Title>Ndrysho Agjentin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Emri</Form.Label>
            <Form.Control
              type="text"
              value={editAgentForm.name}
              onChange={(e) => setEditAgentForm({ ...editAgentForm, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mbiemri</Form.Label>
            <Form.Control
              type="text"
              value={editAgentForm.surname}
              onChange={(e) => setEditAgentForm({ ...editAgentForm, surname: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={editAgentForm.email}
              onChange={(e) => setEditAgentForm({ ...editAgentForm, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telefoni</Form.Label>
            <Form.Control
              type="text"
              value={editAgentForm.phone_number}
              onChange={(e) => setEditAgentForm({ ...editAgentForm, phone_number: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Viti i Fillimit</Form.Label>
            <Form.Control
              type="number"
              value={editAgentForm.startYear}
              onChange={(e) => {
                const newStartYear = e.target.value;
                if (newStartYear <= currentYear) {
                  setEditAgentForm({ ...editAgentForm, startYear: newStartYear });
                }
              }}
              max={currentYear}
              isInvalid={editAgentForm.startYear > currentYear}
            />
            <Form.Control.Feedback type="invalid">
              Viti i Fillimit nuk mund të jetë më i madh se ky vit.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Vlerësimi</Form.Label>
            <Form.Control
              as="select"
              value={editAgentForm.rating}
              onChange={(e) => setEditAgentForm({ ...editAgentForm, rating: parseFloat(e.target.value) })}
            >
              <option value="4">4</option>
              <option value="4.5">4.5</option>
              <option value="5">5</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseUpdateAgentModal}>
          Mbyll
        </Button>
        <Button variant="primary" onClick={handleAgentUpdate}>
          Ruaj Ndryshimet
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AgentModal;
