import { io } from "socket.io-client";

export interface StoryboardSocketHandlers {
  onOnboardingComplete?: (event: { storyId: string }) => void;
  onError?: (message: string) => void;
  onPlatformSuccess?: (event: { storyId: string; data: any }) => void;
  onInterrogateSuccess?: (event: { storyId: string; data: any }) => void;
  onStatusChange?: (
    state:
      | "connecting"
      | "connected"
      | "reconnecting"
      | "disconnected"
      | "error"
  ) => void;
}

const joinStoryRoom = (socket: ReturnType<typeof io>, storyId: string) => {
  const normalizedStoryId = storyId.trim();
  if (!normalizedStoryId) {
    return;
  }

  socket.emit("join-story", { storyId: normalizedStoryId });
};

export const connectStoryboardSocket = (
  storyId: string,
  handlers: StoryboardSocketHandlers
) => {
  const normalizedStoryId = storyId?.trim();
  if (!normalizedStoryId) {
    handlers.onError?.("Missing storyId for storyboard socket");
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    handlers.onError?.("Missing NEXT_PUBLIC_API_URL for realtime progress");
    return null;
  }

  const url = `${baseUrl.replace(/\/$/, "")}/storyboard`;

  const log = (event: string, details?: Record<string, unknown>) => {
    if (details) {
      console.debug("[storyboard]", event, details);
      return;
    }

    console.debug("[storyboard]", event);
  };

  log("initializing", { storyId: normalizedStoryId, url });

  const socket = io(url, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 4000,
    query: { storyId: normalizedStoryId },
  });

  handlers.onStatusChange?.("connecting");

  socket.on("connect", () => {
    log("connected", {
      socketId: socket.id,
      transport: socket.io.engine.transport.name,
      connected: socket.connected,
    });
    handlers.onStatusChange?.("connected");
    log("join-story:emit", { storyId: normalizedStoryId, socketId: socket.id });
    joinStoryRoom(socket, normalizedStoryId);
  });

  socket.on("disconnect", (reason) => {
    log("disconnected", {
      socketId: socket.id,
      reason,
      connected: socket.connected,
    });
    handlers.onStatusChange?.("disconnected");
  });

  socket.on("platform", (event: { storyId: string; data: any }) => {
    log("platform", event);
    if (event.storyId === normalizedStoryId) {
      handlers.onPlatformSuccess?.(event);
    }
  });

  socket.on("interrogate", (event: { storyId: string; data: any }) => {
    log("interrogate", event);
    if (event.storyId === normalizedStoryId) {
      handlers.onInterrogateSuccess?.(event);
    }
  });

  socket.on("onboard", (event: { storyId: string }) => {
    log("onboard", event);
    if (event.storyId === normalizedStoryId) {
      handlers.onOnboardingComplete?.(event);
    }
  });

  socket.io.on("reconnect", () => {
    log("reconnected", { storyId: normalizedStoryId, socketId: socket.id });
    joinStoryRoom(socket, normalizedStoryId);
  });

  return socket;
};
