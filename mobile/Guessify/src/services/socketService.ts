import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_URL } from '@env';

const socketUrl = `${API_URL}/ws`;

let stompClient: Client | null = null;
let isConnected = false;
let pendingSubscriptions: { topic: string; callback: (data: any) => void }[] = [];
const activeSubscriptions: { [topic: string]: () => void } = {};
let connectResolver: (() => void) | null = null;
let connectPromise: Promise<void> | null = null;

/**
 * Initializes the socket connection.
 * Call this once (e.g. in App.tsx or GameProvider).
 */
export const initializeSocket = (): Promise<void> => {
  if (stompClient && stompClient.connected) {
    console.log('✅ Already connected (cached)');
    return Promise.resolve();
  }

  if (connectPromise) {
    console.log('⏳ Connection already in progress...');
    return connectPromise;
  }

  console.log('🌐 Connecting to WebSocket at', socketUrl);

  connectPromise = new Promise((resolve, reject) => {
    connectResolver = resolve;

    stompClient = new Client({
      webSocketFactory: () => {
        console.log('🧪 Creating SockJS connection');
        return new SockJS(socketUrl);
      },
      reconnectDelay: 5000,
      debug: (msg) => console.log('[STOMP DEBUG]', msg),

      onConnect: () => {
        console.log('✅ STOMP connected');
        isConnected = true;
        connectResolver?.();
        connectResolver = null;

        pendingSubscriptions.forEach(({ topic, callback }) => {
          subscribeToSocket(topic, callback);
        });
        pendingSubscriptions = [];
      },

      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame.headers['message']);
      },

      onWebSocketError: (event) => {
        console.error('🛑 WebSocket connection error:', event);
        reject(new Error('WebSocket connection failed'));
        connectResolver = null;
        connectPromise = null;
        stompClient = null;
        isConnected = false;
      },
    });

    stompClient.activate();
  });

  return connectPromise;
};


/**
 * Sends a message over STOMP.
 */
export const sendToSocket = (destination: string, body: any) => {
  if (stompClient && isConnected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  } else {
    console.warn(`⚠️ Cannot send to ${destination} — STOMP not connected`);
  }
};

/**
 * Subscribes to a STOMP topic, or queues it until connected.
 */
export const subscribeToSocket = async (
  topic: string,
  callback: (data: any) => void
): Promise<() => void | undefined> => {
  await initializeSocket();

  if (!stompClient || !isConnected) {
    console.warn(`🕒 STOMP not connected even after init. Queuing subscription to ${topic}`);
    pendingSubscriptions.push({ topic, callback });
    return;
  }

  // Zapobiegaj duplikatom
  if (activeSubscriptions[topic]) {
    console.warn(`⚠️ Already subscribed to ${topic}`);
    return;
  }

  console.log(`📡 Subscribing to ${topic}`);
  const subscription = stompClient.subscribe(topic, (message: IMessage) => {
    try {
      const data = JSON.parse(message.body);
      callback(data);
    } catch (e) {
      console.error('❌ Failed to parse STOMP message', e);
    }
  });

  activeSubscriptions[topic] = () => subscription.unsubscribe();
  return () => subscription.unsubscribe();
};

/**
 * Gracefully disconnects from STOMP and clears all data.
 */
export const disconnectSocket = () => {
  if (stompClient) {
    Object.values(activeSubscriptions).forEach((unsubscribe) => unsubscribe());
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
    pendingSubscriptions = [];
    console.log('🛑 STOMP fully disconnected');
  }
};
