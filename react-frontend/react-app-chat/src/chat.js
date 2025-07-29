import './css/chat.css';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer, Sidebar, ConversationList, Conversation,
    ChatContainer, MessageList, Message,
    ConversationHeader, VoiceCallButton, VideoCallButton,
    MessageInput, Avatar, AddUserButton, InfoButton, Button, ArrowButton, Search
} from '@chatscope/chat-ui-kit-react';
import React, { useState, useEffect } from 'react';
import { type } from '@testing-library/user-event/dist/type';


const Chat = () => {
    const [messages, setMessages] = useState([
        {
            payload: "Hello \nHow are you?",
            sentTime: "just now",
            sender: "Jane",
            direction: "incoming",
            position: "single"
        }
    ]);

    const messageObj = {
        //message: "", is an alias for model.payload, this is for backward compatibility. model.payload property has precedence over model.message.
        sentTime: new Date().toLocaleTimeString(),
        sender: "user",
        direction: "outgoing",
        position: "single",
        payload: ""

    };

    function sendMessage(messageText) {
        messageObj.payload = messageText;
        console.log("Message sent: ", messageObj.payload);
        console.log("Message sent time: ", messageObj.sentTime);
        setMessages(prevMessages => [...prevMessages, messageObj]);

        //then send the message to a server
    }

    // useEffect(() => {       //possible real implementation of receiving messages from a server
    //     const socket = new WebSocket('ws://localhost:8080/chat');

    //     socket.onmessage = (event) => {
    //         const data = JSON.parse(event.data);

    //         const incomingMessage = {
    //             payload: data.payload,
    //             sentTime: data.timestamp,
    //             sender: data.sender,
    //             direction: "incoming",
    //             position: "single",
    //             type: data.type
    //         };

    //         setMessages(prevMessages => [...prevMessages, incomingMessage]);
    //     };

    //     return () => socket.close();
    // }, []);

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

    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    function handleImageClick(imagePayload) {
        setSelectedImage(imagePayload);
        setShowImageModal(true);
    }

    function downloadFile(file) {
        // Create a temporary URL for the file
        const url = URL.createObjectURL(file);

        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name; // Sets the download filename

        // Trigger the download
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function downloadImage(imagePayload) {
        const url = URL.createObjectURL(imagePayload.img);
        const a = document.createElement('a');
        a.href = url;
        a.download = imagePayload.imgName; // Note: imgName not fileName
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const [searchValue, setSearchValue] = useState("");

    const [showNewChatModal, setShowNewChatModal] = useState(false);

    const [availableUsers, setAvailableUsers] = useState([
        { id: 1, name: "Alice", avatar: "/imgs/profile.png", status: "online" },
        { id: 2, name: "Bob", avatar: "/imgs/profile.png", status: "offline" }
    ]); // This would come from the backend

    function startNewChat(user) {
        const existingConv = conversations.find(conv => conv.name === user.name);

        if (existingConv) {
            // If exists, just activate it
            setActiveConversationId(existingConv.id);
            setConversations(prev => prev.map(conv => ({
                ...conv,
                active: conv.id === existingConv.id
            })));
        } else {
            // Create new conversation and add to top
            const newConversation = {
                id: Date.now(), // Simple ID generation
                name: user.name,
                info: user.info,
                status: user.status,
                avatar: user.avatar,
                lastSenderName: user.name,
                active: true
            };

            // Add to top and deactivate others
            setConversations(prev => [
                newConversation,
                ...prev.map(conv => ({ ...conv, active: false }))
            ]);

            setActiveConversationId(newConversation.id);
            setAvailableUsers(prev => prev.filter(availableUser => availableUser.id !== user.id));
        }

        // Clear messages for new/activated chat
        setMessages([]);
        setShowNewChatModal(false);

        console.log("Started chat with:", user.name);
    }

    const [conversations, setConversations] = useState([
        { id: 1, name: "Joe", lastSenderName: "Joe", status: "offline", avatar: "/imgs/profile.png", active: false },
        { id: 2, name: "Jane", lastSenderName: "Jane", status: "online", avatar: "/imgs/profile.png", active: true }
    ]);

    const [activeConversationId, setActiveConversationId] = useState(conversations.size);
    const activeConversation = conversations.find(conv => conv.id === activeConversationId);

    return (
        <div className="chatPage-div" >
            <title>Chat Application</title>
            <MainContainer>

                <Sidebar position='left'>
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        margin: '20px'
                    }}>
                        <AddUserButton border style={{ flex: 1 }} onClick={() => setShowNewChatModal(true)}>
                            Yeni Sohbet
                        </AddUserButton>

                        <AddUserButton border style={{ flex: 1 }} /*onClick={() =>} tüm kullanıcıları getirip gösterecek bir fonksiyon */>
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
                                lastSenderName={conv.lastSenderName}
                                info={conv.info}
                                active={conv.active}
                                onClick={() => {
                                    setActiveConversationId(conv.id);
                                    setConversations(prev => prev.map(c => ({
                                        ...c,
                                        active: c.id === conv.id
                                    })));
                                    // Load messages for this conversation
                                    setMessages([]); // Or load from storage/API
                                }}
                            >
                                <Avatar src={conv.avatar} />
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
                            <h3 style={{ color: "steelblue" }} >Choose Attachment Type </h3>
                            <div style={{ display: 'center', gap: '15px', marginTop: '30px' }}>
                                <ArrowButton border direction="up" style={{ color: "deepskyblue", marginRight: '10px', borderColor: "deepskyblue" }}
                                    onClick={handleFileUpload}>Upload File</ArrowButton>

                                <ArrowButton border direction="up" style={{ color: "deepskyblue", borderColor: "deepskyblue" }}
                                    onClick={handleImageUpload}>Send Image</ArrowButton>
                            </div>
                            <Button onClick={() => setShowAttachModal(false)} style={{ marginTop: '15px' }}>Cancel</Button>
                        </div>
                    </div>
                )}

                {showImageModal && selectedImage && (
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
                            <div style={{ marginBottom: '15px', display: 'flex', gap: '15px', justifyContent: 'right' }}>
                                <ArrowButton border direction="down" style={{ color: "deepskyblue", marginRight: '10px', borderColor: "deepskyblue" }}
                                    onClick={() => downloadImage(selectedImage)}>Download</ArrowButton>

                                <Button border onClick={() => setShowImageModal(false)}>Close</Button>
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
                )}

                {showNewChatModal && (
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
                            <h3 style={{ color: "steelblue" }}>Start New Chat</h3>
                            <div style={{ marginTop: '15px' }}>
                                {availableUsers.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => startNewChat(user)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '10px',
                                            cursor: 'pointer',
                                            borderRadius: '5px',
                                            marginBottom: '5px'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        <Avatar src={user.avatar} size="sm" />
                                        <div style={{ marginLeft: '10px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                                            <div style={{ fontSize: '12px', color: user.status === 'online' ? 'green' : 'gray' }}>
                                                {user.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={() => setShowNewChatModal(false)} style={{ marginTop: '15px' }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}


            </MainContainer>
        </div >
    );
}

export default Chat;