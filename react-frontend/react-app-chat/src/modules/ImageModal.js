import { Button, ArrowButton} from '@chatscope/chat-ui-kit-react';

const ImageModal = ({ selectedImage, onDownload, onClose }) => {
  if (!selectedImage) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1001
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '90%',
        maxHeight: '90%',
        textAlign: 'center'
      }}>
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          gap: '15px',
          justifyContent: 'right'
        }}>
          <ArrowButton
            border
            direction="down"
            style={{ color: "deepskyblue", marginRight: '10px', borderColor: "deepskyblue" }}
            onClick={() => onDownload(selectedImage)}
          >
            Download
          </ArrowButton>

          <Button onClick={onClose}>Close</Button>
        </div>

        <img
          src={URL.createObjectURL(selectedImage.img)}
          alt={selectedImage.imgName}
          style={{
            maxWidth: '100%',
            maxHeight: '70vh',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
};

export default ImageModal;
