import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Modal, Table, Nav, Tab } from 'react-bootstrap';
import { Trash2, Edit, Eye } from 'lucide-react';
import axios from 'axios';
import UpdateAgentModal from './UpdateAgentModal';
import MessageModal from './MessageModal';
import UserModal from './UserModal';
import NewAgentModal from './NewAgentModal';
import VerifyPropertyCard from './VerifyPropertyCard';
import AdminPropertyCard from './AdminPropertyCard';
import Navigation from '../landingpage/Navigation';
import FooterNav from '../landingpage/FooterNav';
import Header from '../landingpage/Header';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [agents, setAgents] = useState([]);
    const [properties, setProperties] = useState({
        unverified: [],
        verified: [],
        sold: []
    });
    const currentYear = new Date().getFullYear();
    const [messages, setMessages] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showUpdateAgentModal, setShowUpdateAgentModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showAddAgentModal, setShowAddAgentModal] = useState(false);
    const [newAgentForm, setNewAgentForm] = useState({
        name: '',
        surname: '',
        email: '',
        phone_number: '',
        startYear: '',
        rating: '4'
    });

     useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    const handleAddAgent = () => {
        setShowAddAgentModal(true);
    };

    const handleCloseAddAgentModal = () => {
        setShowAddAgentModal(false);
        
    };

    const handleNewAgentSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/addAgent', newAgentForm);
            if (response.status === 201) {
                setShowAddAgentModal(false);
                setNewAgentForm({
                    name: '',
                    surname: '',
                    email: '',
                    phone_number: '',
                    startYear: '',
                    rating: '4'
                });
                fetchData(); // Refresh the agent list
            }
        } catch (error) {
            console.error('Error adding new agent:', error);
        }
    };

    const [editForm, setEditForm] = useState({
        username: '',
        email: '',
        role: '',
        email_verified: ''
    });
    const [editAgentForm, setEditAgentForm] = useState({
        name: '',
        surname: '',
        email: '',
        phone_number: '',
        startYear: '',
        rating: ''
    });
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        // Get the logged-in user ID from localStorage
        const userId = localStorage.getItem('userId');
        setLoggedInUserId(userId);
    }, []);

    useEffect(() => {
        fetchData();
        
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, agentsRes, propertiesRes, messagesRes] = await Promise.all([
                fetch('http://localhost:5000/users'),
                fetch('http://localhost:5000/getAllAgents'),
                fetch('http://localhost:5000/getUnverifiedVerifiedSold'),
                fetch('http://localhost:5000/messages')
            ]);
    
            const usersData = await usersRes.json();
            const agentsData = await agentsRes.json();
            const propertiesData = await propertiesRes.json();
            const messagesData = await messagesRes.json();
    
            console.log("Raw Properties Data:", propertiesData); // Debugging line
    
            setMessages(messagesData.data);
            setAgents(agentsData);
            setUsers(usersData.data);
    
            if (Array.isArray(propertiesData)) {
                setProperties({
                    unverified: propertiesData.filter(p => p?.status?.trim().toLowerCase() === 'ne verifikim'),
                    verified: propertiesData.filter(p => p?.status?.trim().toLowerCase() === 'ne shitje'),
                    sold: propertiesData.filter(p => p?.status?.trim().toLowerCase() === 'e shitur')
                });
    
                console.log("Filtered Properties:", {
                    unverified: propertiesData.filter(p => p?.status?.trim().toLowerCase() === 'ne verifikim'),
                    verified: propertiesData.filter(p => p?.status?.trim().toLowerCase() === 'ne shitje'),
                    sold: propertiesData.filter(p => p?.status?.trim().toLowerCase() === 'e shitur')
                }); // Debugging line
            } else {
                console.error("Error: propertiesData is not an array", propertiesData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    const handleUserEdit = (user) => {
        setSelectedUser(user);
        setEditForm({
            username: user.username,
            email: user.email,
            role: user.role
        });
        setShowUserModal(true);
    };

    const handleAgentEdit = (agent) => {
        setSelectedAgent(agent);
        setEditAgentForm({
            name: agent.name,
            surname: agent.surname,
            email: agent.email,
            phone_number: agent.phone_number,
            startYear: agent.startYear,
            startYear: agent.startYear,
            rating: agent.rating
        });
        setShowUpdateAgentModal(true);
    };

    const handleUserUpdate = async () => {
        try {
            const response = await axios.patch(`http://localhost:5000/updateUserByAdmin/${selectedUser._id}`, {
                ...editForm,
                email_verified: editForm.email !== selectedUser.email ? 0 : selectedUser.email_verified,
                remember_me_token: editForm.email !== selectedUser.email ? null : selectedUser.remember_me_token
            });

            if (response.status === 200) {
                setShowUserModal(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleAgentUpdate = async () => {
        try {
            const response = await axios.patch(`http://localhost:5000/updateAgent/${selectedAgent._id}`, {
                ...editAgentForm
            });

            if (response.status === 200) {
                setShowUpdateAgentModal(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error updating agent:', error);
        }
    };

    const handleUserDelete = async (userId) => {
        // Display a confirmation dialog in Albanian
        const confirmed = window.confirm("A jeni të sigurt që dëshironi të fshini këtë përdorues? Ky veprim është i pandryshueshëm.");

        if (confirmed) {
            try {
                const response = await axios.delete(`http://localhost:5000/deleteUser/${userId}`);
                if (response.status === 200) {
                    fetchData(); // Refresh the data after deletion
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        } else {
            console.log("Përdoruesi nuk u fshi."); // Log message if user cancels
        }
    };

    const handleAgentDelete = async (agentId) => {
        // Display a confirmation dialog in Albanian
        const confirmed = window.confirm("A jeni të sigurt që dëshironi të fshini këtë agjent? Ky veprim është i pandryshueshëm.");

        if (confirmed) {
            try {
                const response = await axios.delete(`http://localhost:5000/deleteAgent/${agentId}`);
                if (response.status === 200) {
                    fetchData(); // Refresh the data after deletion
                }
            } catch (error) {
                console.error('Gabim gjatë fshirjes së agjentit:', error);
            }
        } else {
            console.log("Agjenti nuk u fshi."); // Log message if user cancels
        }
    };

   

    const handleMessageDelete = async (messageId) => {
        const confirmed = window.confirm("A jeni të sigurt që dëshironi të fshini këtë mesazh? Ky veprim është i pandryshueshëm.");

        if (confirmed) {
            try {
                const response = await axios.delete(`http://localhost:5000/deleteMessage/${messageId}`);
                if (response.status === 200) {
                    fetchData(); // Refresh the data after deletion
                }
            } catch (error) {
                console.error('Gabim gjatë fshirjes së mesazhit:', error);
            }
        }
    };


    const handleViewMessage = (message) => {
        setSelectedMessage(message);
        setShowMessageModal(true);
    };

    const handleCloseMessageModal = () => {
        setShowMessageModal(false);
        setSelectedMessage(null);
    };

    const handleCloseUpdateAgentModal = () => {
        setShowUpdateAgentModal(false);
        setSelectedAgent(null);
    };

    return (
       <>
       <Navigation></Navigation>
       
        <div className="container mt-4 mb-5" style={{minHeight:'80vh'}}>
        <div className="mt-5 mb-5">
        <Header name={"Admin"}/>
       </div>
            <Tab.Container defaultActiveKey="users">
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link eventKey="users">Përdoruesit</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="agents">Agjentët</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="properties">Pronat</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="messages">Mesazhet</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="users">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Përdoruesi</th>
                                    <th>Email</th>
                                    <th>Roli</th>
                                    <th>Veprime</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        {loggedInUserId !== user._id ?
                                            <td>

                                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleUserEdit(user)}>
                                                    <Edit size={16} />
                                                </Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleUserDelete(user._id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </td>
                                            :
                                            <td>
                                                Llogaria juaj
                                            </td>
                                        }
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tab.Pane>

                    <Tab.Pane eventKey="agents">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Emri</th>
                                    <th>Email</th>
                                    <th>Telefoni</th>
                                    <th>Vlerësimi</th>
                                    <th>Veprime</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agents.map(agent => (
                                    <tr key={agent._id}>
                                        <td>{agent.name} {agent.surname}</td>
                                        <td>{agent.email}</td>
                                        <td>{agent.phone_number}</td>
                                        <td>{agent.rating}</td>
                                        <td>
                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleAgentEdit(agent)}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleAgentDelete(agent._id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Add Agent Button */}
                        <div className="mt-3 text-end">
                            <Button variant="primary" onClick={handleAddAgent}>
                               + Shto Agjent
                            </Button>
                        </div>
                    </Tab.Pane>


                    <Tab.Pane eventKey="properties">
                        <h4 className="mb-3">Prona në Verifikim</h4>
                        <div className="row g-4 mb-5">
                            {properties.unverified.map(property => (
                                <div key={property._id} className="col-12 col-md-6 col-lg-4">
                                    <VerifyPropertyCard {...property} fetchData={fetchData} id={property._id} />
                                    
                                </div>
                            ))}
                        </div>

                        <h4 className="mb-3">Prona në Shitje</h4>
                        <div className="row g-4 mb-5">
                            {properties.verified.map(property => (
                                <div key={property._id} className="col-12 col-md-6 col-lg-4">
                                    <AdminPropertyCard {...property} fetchData={fetchData} id={property._id}  />
                                </div>
                            ))}
                        </div>

                        <h4 className="mb-3">Prona të Shitura</h4>
                        <div className="row g-4">
                            {properties.sold.map(property => (
                                <div key={property._id} className="col-12 col-md-6 col-lg-4">
                                    <AdminPropertyCard {...property} fetchData={fetchData} id={property._id}  />
                                </div>
                            ))}
                        </div>

                        {/* Add Property Button */}
                        <div className="mt-3 mb-4 text-end">
                            <Button variant="primary" href={'/addProperty'} >
                                + Shto Pronë
                            </Button>
                        </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="messages">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Emri</th>
                                    <th>Email</th>
                                    <th>Telefoni</th>
                                    <th>Mesazhi</th>
                                    <th>Veprime</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(messages) && messages.length > 0 ? (
                                    messages.map((message) => (
                                        <tr key={message._id}>
                                            <td>{message.name}</td>
                                            <td>{message.email}</td>
                                            <td>{message.phone}</td>
                                            <td>{message.message.length > 20 ? `${message.message.substring(0, 20)}...` : message.message}</td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleViewMessage(message)}
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleMessageDelete(message._id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Nuk ka mesazhe për të shfaqur</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Tab.Pane>


                </Tab.Content>
            </Tab.Container>


            {/* User Edit Modal */}
            {/* UserModal */}
            <UserModal
                showUserModal={showUserModal}
                setShowUserModal={setShowUserModal}
                editForm={editForm}
                setEditForm={setEditForm}
                handleUserUpdate={handleUserUpdate}
            />
            {/* Agent Edit Modal */}
            <UpdateAgentModal
                showUpdateAgentModal={showUpdateAgentModal}
                handleCloseUpdateAgentModal={handleCloseUpdateAgentModal}
                editAgentForm={editAgentForm}
                setEditAgentForm={setEditAgentForm}
                handleAgentUpdate={handleAgentUpdate}
            />

            {/* Message View Modal */}
            <MessageModal
                showMessageModal={showMessageModal}
                handleCloseMessageModal={handleCloseMessageModal}
                selectedMessage={selectedMessage}
            />

              {/* Agent Create Modal */}
              <NewAgentModal
              
               
              showNewAgentModal={showAddAgentModal}
              handleCloseNewAgentModal={handleCloseAddAgentModal}
              newAgentForm={newAgentForm}
              setNewAgentForm={setNewAgentForm}
              handleAddAgent={handleNewAgentSubmit}
            />
        </div>
        <FooterNav></FooterNav>
            </>
    );
};

export default AdminDashboard;
