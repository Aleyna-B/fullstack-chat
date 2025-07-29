import React, { useState } from 'react';
import { Button, Avatar } from '@chatscope/chat-ui-kit-react';

const MassMessageModal = ({ availableUsers, onSendMassMessage, onClose }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const toggleUser = (user) => {
        setSelectedUsers(prev => {
            if (prev.some(u => u.id === user.id)) {
                // Already selected → remove
                return prev.filter(u => u.id !== user.id);
            } else {
                // Not selected → add
                return [...prev, user];
            }
        });
    };

    const isSelected = (user) => selectedUsers.some(u => u.id === user.id);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1003
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                width: '400px',
                maxHeight: '60vh',
                overflow: 'auto'
            }}>

                <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ color: "steelblue" }}>Send Mass Message</h3>
                    <Button onClick={onClose}>Cancel</Button>
                </div>


                <div >
                    {availableUsers.map(user => {
                        const selected = isSelected(user);
                        return (
                            <div
                                key={user.id}
                                onClick={() => toggleUser(user)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    marginBottom: '5px',
                                    backgroundColor: selected ? '#e0f7ff' : 'transparent',
                                    border: selected ? '1px solid deepskyblue' : '1px solid transparent'
                                }}
                            >
                                <Avatar src="../imgs/profile.png" size="sm" />
                                <div style={{ marginLeft: '10px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                                    <div style={{ fontSize: '12px', color: user.status === 'online' ? 'green' : 'gray' }}>
                                        {user.status}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'right' }}>
                    <Button border style={{ borderColor: "steelblue" }}
                        disabled={selectedUsers.length === 0}
                        onClick={() => onSendMassMessage(selectedUsers)}
                    >
                        Send to {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MassMessageModal;
