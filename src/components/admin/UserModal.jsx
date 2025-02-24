import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const UserModal = ({
  showUserModal,
  setShowUserModal,
  editForm,
  setEditForm,
  handleUserUpdate
}) => {

  return (
    <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Ndrysho Përdoruesin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Përdoruesi</Form.Label>
            <Form.Control
              type="text"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Roli</Form.Label>
            <Form.Select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            >
              <option value="user">Përdorues</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowUserModal(false)}>
          Mbyll
        </Button>
        <Button variant="primary" onClick={handleUserUpdate}>
          Ruaj Ndryshimet
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
