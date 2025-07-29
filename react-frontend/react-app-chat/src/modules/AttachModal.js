import { Button ,ArrowButton} from '@chatscope/chat-ui-kit-react';


const AttachModal = ({ onFileUpload, onImageUpload, onClose }) => {
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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        minWidth: '300px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: "steelblue" }}>Choose Attachment Type</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'center' }}>
          <ArrowButton
            border
            direction="up"
            style={{ color: "deepskyblue", marginRight: '10px', borderColor: "deepskyblue" }}
            onClick={onFileUpload}
          >
            Upload File
          </ArrowButton>

          <ArrowButton
            border
            direction="up"
            style={{ color: "deepskyblue", borderColor: "deepskyblue" }}
            onClick={onImageUpload}
          >
            Send Image
          </ArrowButton>
        </div>
        <Button onClick={onClose} style={{ marginTop: '15px' }}>Cancel</Button>
      </div>
    </div>
  );
};

export default AttachModal;
