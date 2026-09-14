import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

interface NewOrderNotification {
  title: string;
  body: string;
  orderNumber: string;
  orderId: string;
  totalAmount: number;
  url: string;
}

export function initializeSocket(): Socket | null {
  // Disable Socket.IO in production (Vercel doesn't support WebSockets)
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    console.log("Socket.IO disabled in production (not supported on Vercel serverless)");
    return null;
  }

  if (socket) {
    return socket;
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  socket = io(backendUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
    // Register admin for notifications
    socket?.emit("admin:register");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function onNewOrder(callback: (data: NewOrderNotification) => void): void {
  socket?.on("new-order", callback);
}

export function offNewOrder(callback: (data: NewOrderNotification) => void): void {
  socket?.off("new-order", callback);
}
