import { Button } from '@chatscope/chat-ui-kit-react';

const MassComposeModal = ({
  recipients = [],
  message = '',
  onMessageChange,
  onSend,
  onClose
}) => {
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
        width: '500px',
        maxHeight: '70vh'
      }}>
        <h3>Compose Mass Message</h3>

        {/* Recipients */}
        <div style={{ marginBottom: '15px' }}>
          <strong>To: </strong>
          {recipients.map(user => user.name).join(', ')}
        </div>

        {/* Textarea */}
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder=""
          style={{
            width: '100%',
            height: '150px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            resize: 'vertical'
          }}
        />

        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '15px',
          justifyContent: 'flex-end'
        }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button border onClick={onSend} disabled={!message.trim()}>Send Message</Button>
        </div>
      </div>
    </div>
  );
};

export default MassComposeModal;
