import { Button, Avatar } from '@chatscope/chat-ui-kit-react';

const NewChatModal = ({ availableUsers, onStartNewChat, onClose }) => {
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
      zIndex: 1002
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
          <h3 style={{ color: "steelblue" }}>Start New Chat</h3>
          <Button onClick={onClose}>Cancel</Button>
        </div>

        <div style={{ marginTop: '15px' }}>
          {availableUsers.map(user => (
            <div
              key={user.id}
              onClick={() => onStartNewChat(user)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                cursor: 'pointer',
                borderRadius: '5px',
                marginBottom: '5px'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Avatar src="../imgs/profile.png" size="sm" />
              <div style={{ marginLeft: '10px' }}>
                <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: user.status === 'online' ? 'green' : 'gray' }}>
                  {user.status}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NewChatModal;
