import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_URL } from '@env';

const socketUrl = `${API_URL}/ws`; // lub z .env

let stompClient: Client;

export const connectToSocket = (roomCode: string, onMessage: (msg: any) => void) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    onConnect: () => {
      stompClient.subscribe(`/topic/game/${roomCode}`, (message) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      });
    },
    debug: (str) => console.log(str),
  });

  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient) stompClient.deactivate();
};

export const sendToSocket = (destination: string, body: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  }
};
