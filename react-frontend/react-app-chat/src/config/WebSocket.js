import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export let stompClient = null;

export function connect() {
    return new Promise((resolve, reject) => {
        const socket = new SockJS('http://localhost:8080/chat/v1/ws');

        stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),

            onConnect: (frame) => {
                console.log('Connected: ' + frame);

                // Subscribe to private queue
                stompClient.subscribe('/user/queue/messages', (message) => {
                    console.log("Received:", JSON.parse(message.body));
                });

                resolve(); 
            },

            onStompError: (frame) => {
                console.error('Broker error: ' + frame.headers['message']);
                console.error('Details: ' + frame.body);
                reject(new Error(frame.body));
            },

            onWebSocketError: (event) => {
                console.error('WebSocket error', event);
                reject(event);
            }
        });

        stompClient.activate();
    });
}

export function sendChatMessage(msg) {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify(msg)
        });
    } else {
        console.error("STOMP client is not connected yet!");
    }
}
