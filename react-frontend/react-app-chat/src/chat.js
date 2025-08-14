import './css/chat.css';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer, Sidebar, ConversationList, Conversation,
    ChatContainer, MessageList, Message, AttachmentButton,
    ConversationHeader, VoiceCallButton, VideoCallButton,
    MessageInput, Avatar, AddUserButton, InfoButton, Button, ArrowButton, Search
} from '@chatscope/chat-ui-kit-react';
import React, { useState, useEffect } from 'react';
import { type } from '@testing-library/user-event/dist/type';
import { downloadFile, downloadImage } from './modules/downloadFuncs';
import AttachModal from './modules/AttachModal';
import ImageModal from './modules/ImageModal';
import NewChatModal from './modules/NewChatModal';
import MassMessageModal from './modules/MassMessageReciepentsModal';
import axiosInstance from './config/axiosConfig';
import { connect, sendChatMessage } from './config/WebSocket';


const Chat = () => {
    const [messages, setMessages] = useState([]);

    const messageObj = {
        //message: "", is an alias for model.payload, this is for backward compatibility. model.payload property has precedence over model.message.
        sentTime: new Date().toLocaleTimeString(),
        sender: "user",
        direction: "outgoing",
        position: "single",
        payload: ""
    };

    const [showAttachModal, setShowAttachModal] = useState(false);

    function handleAttachClick() {
        setShowAttachModal(true);
    }

    function handleFileUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true; // Allow multiple file selection
        input.accept = '*/*'; // Accept all file types, or specify like 'image/*,.pdf,.doc,.docx'

        input.onchange = (event) => {
            const files = Array.from(event.target.files);
            if (files.length > 0) {
                //uploadFilesToServer(files);
            }

            files.forEach(file => {
                const fileMessageObj = {
                    message: "", // Keep empty for file messages
                    payload: {
                        type: "file",
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                        file: file // Store the actual file object
                    },
                    sentTime: new Date().toLocaleTimeString(),
                    sender: "user",
                    direction: "outgoing",
                    position: "single"
                };
                console.log("File message object created: ", fileMessageObj);
                console.log("File name: ", fileMessageObj.payload.fileName);
                console.log("File sent time: ", fileMessageObj.sentTime);

                setMessages(prevMessages => [...prevMessages, fileMessageObj]);
            });
        };

        input.click();
        setShowAttachModal(false);
    }

    function handleImageUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true; // Allow multiple file selection
        input.accept = 'image/*'; // Accept all file types, or specify like 'image/*,.pdf,.doc,.docx'

        input.onchange = (event) => {
            const images = Array.from(event.target.files);
            if (images.length > 0) {
                //uploadFilesToServer(files);
            }

            images.forEach(image => {
                const imgMessageObj = {
                    message: "", // Keep empty for file messages
                    payload: {
                        type: "image",
                        imgName: image.name,
                        imgSize: image.size,
                        imgType: image.type,
                        img: image // Store the actual file object
                    },
                    sentTime: new Date().toLocaleTimeString(),
                    sender: "user",
                    direction: "outgoing",
                    position: "single"
                };
                console.log("File message object created: ", imgMessageObj);
                console.log("File name: ", imgMessageObj.payload.imgName);
                console.log("File sent type: ", imgMessageObj.imgType);
                console.log("File sent size: ", imgMessageObj.imgSize);

                setMessages(prevMessages => [...prevMessages, imgMessageObj]);
            });
        };

        input.click();
        setShowAttachModal(false);
    }

    async function sendMessage(messageText) { //!handle empty messages later!
        messageObj.payload = messageText;   //for rendering purposes

        const sendThis = {
            recipientId: activeConversationId, // Assuming activeConversationId is the ID of the recipient
            content: messageText,
            timestamp: new Date()
        };

        try {
            await connect(); // Wait until connected
            console.log("Now safe to send messages");
            console.log("Message sent: ", messageObj.payload);
            console.log("Message sent to backend: ", sendThis);
            console.log("Message sent time: ", messageObj.sentTime);
            setMessages(prevMessages => [...prevMessages, messageObj]);

            sendChatMessage(sendThis);
        }
        catch (error) {
            console.error("Failed to connect:", error);
        }
    }


    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    function handleImageClick(imagePayload) {
        setSelectedImage(imagePayload);
        setShowImageModal(true);
    }

    const [searchValue, setSearchValue] = useState(""); // For search functionality in conversation list

    const [allContacts, setAllContacts] = useState([]);
    useEffect(() => {
        axiosInstance.get('/users')
            .then(response => {
                setAllContacts(response.data);
                console.log('/users response:', response.data);
            })
            .catch(error => {
                console.error('Error fetching:', error);
            });
    }, []);

    const [conversations, setConversations] = useState([]);
    useEffect(() => {
        axiosInstance.get('/messages')
            .then(response => {
                setConversations(response.data);
                console.log('/messages response:', response.data);
            })
            .catch(error => {
                console.error('Error fetching:', error);
            });
    }, []);

    const availableUsers = allContacts.filter(contact =>
        !conversations.some(conv => conv.id === contact.id)
    );

    const [activeConversationId, setActiveConversationId] = useState();
    const activeConversation = conversations.find(conv => conv.id === activeConversationId);

    function fetchChatMessages(recipientId) {
        return axiosInstance.get(`/messages/${recipientId}`)
            .then(response => {

                return response.data.map(msg => ({
                    id: msg.id,
                    sender: msg.senderId,
                    recipientId: msg.recipientId,
                    payload : msg.content,
                    sentTime: msg.timestamp,
                    direction: msg.senderId === recipientId ? "incoming" : "outgoing",
                    position: "single"
                }));
            })
            .catch(error => {
                console.error("Error fetching messages:", error);
                return [];
            });
    }

    const [showNewChatModal, setShowNewChatModal] = useState(false);
    function startNewChat(user) {       //newchatmodelin map fonksiyonundaki user
        // Create new conversation object
        const newConversation = {
            id: user.id,
            name: user.name,
            active: true
        };

        // Add to conversations list and deactivate others
        setConversations(prev => [
            newConversation,
            ...prev.map(conv => ({ ...conv, active: false }))
        ]);

        setActiveConversationId(newConversation.id);
        // Clear messages for new chat
        setMessages([]);
        setShowNewChatModal(false);

        console.log("Started conversation with:", user.name);
    }

    const [showMassMessageModal, setShowMassMessageModal] = useState(false);
    const [showMassComposeModal, setShowMassComposeModal] = useState(false);
    const [selectedMassRecipients, setSelectedMassRecipients] = useState([]);
    const [massMessages, setMassMessages] = useState([]);

    function handleSendMassMessage(selectedUsers) {
        console.log("Mass message recipients:", selectedUsers);
        setSelectedMassRecipients(selectedUsers);
        setShowMassMessageModal(false);
        setShowMassComposeModal(true);
    }

    function sendMassMessage(messageText) {
        messageObj.payload = messageText;
        console.log("Mass message sent: ", messageObj.payload);
        setMassMessages(prevMessages => [...prevMessages, messageObj]);

        const userIds = selectedMassRecipients.map(u => u.id);

        console.log("Sending mass message:", messageText, "to:", userIds);
    }

    function handleMassMessageCancel() {
        setShowMassComposeModal(false);
        setSelectedMassRecipients([]);
        setMassMessages([]);
    }


    return (
        <div className="chatPage-div" >
            <title>Chat</title>
            <MainContainer>

                <Sidebar position='left'>
                    <div style={{
                        marginTop: '15px', marginRight: '15px', marginLeft: '15px'
                    }}>
                        <AddUserButton border onClick={() => setShowNewChatModal(true)}>
                            Yeni Sohbet
                        </AddUserButton>

                        <AddUserButton border onClick={() => setShowMassMessageModal(true)}>
                            Toplu Mesaj
                        </AddUserButton>
                    </div>

                    <ConversationList>
                        <Search style={{ margin: '15px' }} placeholder="Search..."
                            value={searchValue}
                            onChange={(v) => setSearchValue(v)}
                            onClearClick={() => setSearchValue("")} />

                        {conversations.map(conv => (
                            <Conversation
                                key={conv.id}
                                name={conv.name}
                                active={conv.active}
                                status={conv.status}
                                onClick={() => {
                                    setActiveConversationId(conv.id);
                                    setConversations(prev => prev.map(c => ({
                                        ...c,
                                        active: c.id === conv.id
                                    })));

                                    fetchChatMessages(conv.id)
                                        .then(mappedMessages => {
                                            setMessages(mappedMessages);
                                        });
                                }}
                            >
                                <Avatar src="/imgs/profile.png" />
                            </Conversation>
                        ))}
                    </ConversationList>
                </Sidebar>

                <ChatContainer>
                    <ConversationHeader>
                        <Avatar src="/imgs/profile.png" />
                        <ConversationHeader.Content userName={activeConversation?.name} info={activeConversation?.status} />
                        <ConversationHeader.Actions>
                            <VoiceCallButton style={{ marginRight: '10px' }} />
                            <VideoCallButton style={{ marginRight: '20px' }} />
                            <InfoButton />
                        </ConversationHeader.Actions>
                    </ConversationHeader>

                    <MessageList>

                        {messages.map((msg, index) => {
                            if (msg.payload?.type === "file") {
                                return (
                                    <div>

                                        <Message
                                            key={index}
                                            model={{
                                                type: "custom",
                                                sentTime: msg.sentTime,
                                                sender: msg.sender,
                                                direction: msg.direction,
                                                position: msg.position
                                            }}
                                            avatarSpacer
                                        >
                                            <Message.CustomContent>
                                                <strong> {msg.payload.fileName}</strong>
                                                <ArrowButton border direction="down" style={{ color: "black", marginLeft: '10px', borderColor: "black" }}
                                                    onClick={() => downloadFile(msg.payload.file)} />
                                                <br />
                                                <img src="/imgs/file.png" width={'50px'}></img>

                                            </Message.CustomContent>
                                        </Message>
                                    </div>
                                );
                            }
                            else if (msg.payload?.type === "image") {
                                const imageUrl = URL.createObjectURL(msg.payload.img); //to show the image in the chat
                                return (
                                    <div>
                                        <Message
                                            key={index}
                                            model={{
                                                type: "image",
                                                sentTime: msg.sentTime,
                                                sender: msg.sender,
                                                direction: msg.direction,
                                                position: msg.position
                                            }}
                                            onClick={() => handleImageClick(msg.payload)}
                                            avatarSpacer >
                                            <Message.ImageContent src={imageUrl} width={300} style={{ cursor: 'pointer' }} />
                                        </Message>
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <Message
                                        key={index}
                                        model={msg}
                                        avatarSpacer
                                    />
                                );
                            }
                        })}

                    </MessageList>

                    <MessageInput autoFocus
                        placeholder="Type message here" onSend={sendMessage}
                        onAttachClick={handleAttachClick}
                    />

                </ChatContainer>

                {showAttachModal && (       //popup for choosing attachment type
                    <AttachModal        //my modal component
                        onFileUpload={handleFileUpload}
                        onImageUpload={handleImageUpload}
                        onClose={() => setShowAttachModal(false)}
                    />
                )}

                {showImageModal && selectedImage && (
                    <ImageModal
                        selectedImage={selectedImage}
                        onDownload={downloadImage}
                        onClose={() => setShowImageModal(false)}
                    />
                )}

                {showNewChatModal && (
                    <NewChatModal
                        availableUsers={availableUsers}
                        onStartNewChat={startNewChat}
                        onClose={() => setShowNewChatModal(false)}
                    />
                )}

                {showMassMessageModal && (
                    <MassMessageModal
                        availableUsers={allContacts}
                        onSendMassMessage={handleSendMassMessage}
                        onClose={() => setShowMassMessageModal(false)}
                    />
                )}

                {showMassComposeModal && (
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
                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'flex-end'
                            }}>
                                <Button onClick={() => handleMassMessageCancel()}>Çık</Button>
                            </div>

                            <ChatContainer>
                                <ConversationHeader>
                                    <ConversationHeader.Content
                                        userName="Toplu Mesaj"
                                        info={selectedMassRecipients.map(user => user.name).join(', ')}
                                    />
                                </ConversationHeader>
                                <MessageList>
                                    {massMessages.map((massmsg, index) => {

                                        return (
                                            <Message
                                                key={index}
                                                model={massmsg}
                                                avatarSpacer
                                            />
                                        );

                                    })}
                                </MessageList>
                                <MessageInput autoFocus
                                    placeholder="Type message here"
                                    onSend={sendMassMessage}
                                //onAttachClick={handleAttachClick} disabled for now
                                />
                            </ChatContainer>
                        </div>
                    </div>
                )}


            </MainContainer>
        </div >
    );
}

export default Chat;