import { io } from "socket.io-client";

export interface AnalysisCompleteEvent {
  storyId: string;
  sceneId?: string;
  runId: string;
  threadsCreated: number;
  threadsUpdated: number;
  diagnostic?: string;
}

export interface IntelligenceSocketHandlers {
  onAnalysisComplete?: (event: AnalysisCompleteEvent) => void;
  onContextUpdated?: (event: { storyId: string; sceneId?: string }) => void;
  onError?: (message: string) => void;
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

export const connectIntelligenceSocket = (
  storyId: string,
  handlers: IntelligenceSocketHandlers
) => {
  const normalizedStoryId = storyId?.trim();
  if (!normalizedStoryId) {
    handlers.onError?.("Missing storyId for intelligence socket");
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    handlers.onError?.("Missing NEXT_PUBLIC_API_URL for intelligence socket");
    return null;
  }

  const url = `${baseUrl.replace(/\/$/, "")}/intelligence`;

  const log = (event: string, details?: Record<string, unknown>) => {
    if (details) {
      console.debug("[intelligence]", event, details);
      return;
    }

    console.debug("[intelligence]", event);
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
    });
    handlers.onStatusChange?.("connected");
    joinStoryRoom(socket, normalizedStoryId);
  });

  socket.on("disconnect", (reason) => {
    log("disconnected", { reason });
    handlers.onStatusChange?.("disconnected");
  });

  socket.on("analysis:complete", (event: AnalysisCompleteEvent) => {
    log("analysis:complete", event);
    if (event.storyId === normalizedStoryId) {
      handlers.onAnalysisComplete?.(event);
    }
  });

  socket.on("context:updated", (event: { storyId: string; sceneId?: string }) => {
    log("context:updated", event);
    if (event.storyId === normalizedStoryId) {
      handlers.onContextUpdated?.(event);
    }
  });

  socket.io.on("reconnect", () => {
    log("reconnected", { storyId: normalizedStoryId });
    joinStoryRoom(socket, normalizedStoryId);
    handlers.onStatusChange?.("connected");
  });

  socket.on("connect_error", (error: Error) => {
    log("connect_error", { message: error.message });
    handlers.onStatusChange?.("error");
    handlers.onError?.(error.message);
  });

  return socket;
};
