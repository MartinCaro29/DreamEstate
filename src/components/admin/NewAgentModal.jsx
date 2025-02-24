import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const NewAgentModal = ({ 
  showNewAgentModal, 
  handleCloseNewAgentModal, 
  newAgentForm, 
  setNewAgentForm, 
  handleAddAgent 
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <Modal show={showNewAgentModal} onHide={handleCloseNewAgentModal}>
      <Modal.Header closeButton>
        <Modal.Title>Shto Agjent</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Emri</Form.Label>
            <Form.Control
              type="text"
              value={newAgentForm.name}
              onChange={(e) => setNewAgentForm({ ...newAgentForm, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mbiemri</Form.Label>
            <Form.Control
              type="text"
              value={newAgentForm.surname}
              onChange={(e) => setNewAgentForm({ ...newAgentForm, surname: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={newAgentForm.email}
              onChange={(e) => setNewAgentForm({ ...newAgentForm, email: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telefoni</Form.Label>
            <Form.Control
              type="text"
              value={newAgentForm.phone_number}
              onChange={(e) => setNewAgentForm({ ...newAgentForm, phone_number: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Viti i Fillimit</Form.Label>
            <Form.Control
              type="number"
              value={newAgentForm.startYear}
              onChange={(e) => {
                const newStartYear = e.target.value;
                if (newStartYear <= currentYear) {
                  setNewAgentForm({ ...newAgentForm, startYear: newStartYear });
                }
              }}
              max={currentYear}
              isInvalid={newAgentForm.startYear > currentYear}
              required
            />
            <Form.Control.Feedback type="invalid">
              Viti i Fillimit nuk mund të jetë më i madh se ky vit.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Vlerësimi</Form.Label>
            <Form.Control
              as="select"
              value={newAgentForm.rating}
              onChange={(e) => setNewAgentForm({ ...newAgentForm, rating: parseFloat(e.target.value) })}
              required
            >
              <option value="4">4</option>
              <option value="4.5">4.5</option>
              <option value="5">5</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseNewAgentModal}>
          Mbyll
        </Button>
        <Button variant="success" onClick={handleAddAgent}>
          Shto Agjent
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewAgentModal;
