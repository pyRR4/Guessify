import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_URL } from '@env';

const socketUrl = `${API_URL}/ws`;

let stompClient: Client | null = null;
let isConnected = false;
let pendingSubscriptions: { topic: string; callback: (data: any) => void }[] = [];

const subscriptions: { [key: string]: () => void } = {};

/**
 * Inicjuje połączenie WebSocket z backendem oraz subskrybuje pokój gry.
 */
export const connectToSocket = (
  roomCode: string,
  onMessage: (msg: any) => void
) => {
  if (stompClient) {
    stompClient.deactivate();
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    reconnectDelay: 5000,
    debug: (msg) => console.log('[STOMP]', msg),

    onConnect: () => {
      isConnected = true;
      console.log('✅ Connected to WebSocket');

      // Subskrypcja główna (start gry itp.)
      stompClient?.subscribe(`/topic/game/${roomCode}`, (message: IMessage) => {
        try {
          const data = JSON.parse(message.body);
          onMessage(data);
        } catch (e) {
          console.error('❌ Failed to parse message', e);
        }
      });

      // Obsługa zaległych subskrypcji
      pendingSubscriptions.forEach(({ topic, callback }) => {
        subscribeToSocket(topic, callback);
      });
      pendingSubscriptions = [];
    },

    onStompError: (frame) => {
      console.error('❌ STOMP error:', frame.headers['message']);
    },

    onDisconnect: () => {
      isConnected = false;
      console.log('🔌 Disconnected from WebSocket');
    }
  });

  stompClient.activate();
};

/**
 * Wysyła wiadomość STOMP.
 */
export const sendToSocket = (destination: string, body: any) => {
  if (stompClient && isConnected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  } else {
    console.warn('⚠️ Cannot send — STOMP not connected');
  }
};

/**
 * Subskrybuje dowolny temat STOMP, albo zapisuje do kolejki.
 */
export const subscribeToSocket = (
  topic: string,
  callback: (data: any) => void
): (() => void) | undefined => {
  if (!stompClient || !isConnected) {
    console.warn(`🕒 STOMP not connected. Queuing subscription to ${topic}`);
    pendingSubscriptions.push({ topic, callback });
    return;
  }

  const subscription = stompClient.subscribe(topic, (message: IMessage) => {
    try {
      const data = JSON.parse(message.body);
      callback(data);
    } catch (e) {
      console.error('❌ Failed to parse message', e);
    }
  });

  subscriptions[topic] = () => subscription.unsubscribe();
  return () => subscription.unsubscribe();
};

/**
 * Rozłącza STOMP i czyści wszystko.
 */
export const disconnectSocket = () => {
  if (stompClient) {
    Object.values(subscriptions).forEach((unsubscribe) => unsubscribe());
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
    pendingSubscriptions = [];
    console.log('🛑 Disconnected from WebSocket');
  }
};
