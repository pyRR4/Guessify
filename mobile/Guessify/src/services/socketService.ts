import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_URL } from '@env';

const socketUrl = `${API_URL}/ws`;

let stompClient: Client;

export const connectToSocket = (roomCode: string, onMessage: (msg: any) => void) => {
  if (stompClient?.connected) return;

  stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    onConnect: () => {
      console.log('✅ Connected to WebSocket');

      // Domyślna subskrypcja pokoju gry
      stompClient.subscribe(`/topic/game/${roomCode}`, (message: IMessage) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      });
    },
    debug: (str) => console.log('[STOMP]', str),
    reconnectDelay: 5000,
  });

  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log('🛑 Disconnected from WebSocket');
  }
};

// 🔁 Nowa funkcja: Subskrybuj temat (np. playlistę)
export const subscribeToSocket = (
  topic: string,
  callback: (data: any) => void
): (() => void) | undefined => {
  if (!stompClient?.connected) {
    console.warn('⚠️ Cannot subscribe — STOMP not connected');
    return;
  }

  const subscription = stompClient.subscribe(topic, (message: IMessage) => {
    const data = JSON.parse(message.body);
    callback(data);
  });

  // Zwracamy funkcję do anulowania subskrypcji
  return () => subscription.unsubscribe();
};

export const sendToSocket = (destination: string, body: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  } else {
    console.warn('⚠️ Cannot send — STOMP not connected');
  }
};
