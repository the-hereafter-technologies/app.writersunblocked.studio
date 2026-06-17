import { io, type Socket } from "socket.io-client";

type BlockAnalyzedEvent = {
  blockId: string;
  storyId: string;
  threadsCreated: number;
  diagnostics?: {
    reason:
      | "success"
      | "no_reference_occurrences"
      | "references_below_threshold"
      | "analyzer_returned_empty"
      | "threads_filtered_by_confidence";
    totalOccurrences: number;
    explicitOccurrences: number;
    inferredOccurrences: number;
    selectedOccurrences: number;
    extractionCount: number;
    minInferredConfidence: number;
  };
};

export type StoryboardCommentEvent = {
  id: string;
  storyId: string;
  blockId: string;
  userId: string;
  parentId: string | null;
  body: string;
  anchorOffset: number | null;
  anchorLength: number | null;
  anchorText: string | null;
  isStale: boolean;
  resolvedAt: string | null;
  resolvedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
    handle: string | null;
  };
};

type StoryboardCommentDeletedEvent = {
  storyId: string;
  commentId: string;
  blockId: string;
  deletedIds: string[];
};

type SceneContentUpdatedEvent = {
  storyId: string;
  sceneId: string;
  versionId: string;
  wordCount: number;
};

type ProgressSocketHandlers = {
  onBlockAnalyzed?: (event: BlockAnalyzedEvent) => void;
  onDreamThreadsUpdated?: (event: { storyId: string }) => void;
  onOnboardingComplete?: (event: { storyId: string }) => void;
  onSceneContentUpdated?: (event: SceneContentUpdatedEvent) => void;
  onStoryboardCommentCreated?: (event: {
    storyId: string;
    comment: StoryboardCommentEvent;
  }) => void;
  onStoryboardCommentUpdated?: (event: {
    storyId: string;
    comment: StoryboardCommentEvent;
  }) => void;
  onStoryboardCommentDeleted?: (event: StoryboardCommentDeletedEvent) => void;
  onStoryboardCommentResolved?: (event: {
    storyId: string;
    comment: StoryboardCommentEvent;
  }) => void;
  onStoryboardCommentReopened?: (event: {
    storyId: string;
    comment: StoryboardCommentEvent;
  }) => void;
  onError?: (message: string) => void;
  onStatusChange?: (
    state:
      | "connecting"
      | "connected"
      | "reconnecting"
      | "disconnected"
      | "error"
  ) => void;
};

export function connectProgressSocket(
  storyId: string,
  handlers: ProgressSocketHandlers
): Socket | null {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    handlers.onError?.("Missing NEXT_PUBLIC_API_URL for realtime progress");
    return null;
  }

  const url = `${baseUrl.replace(/\/$/, "")}/progress`;

  const log = (event: string, details?: Record<string, unknown>) => {
    if (details) {
      console.debug("[progress-socket]", event, details);
      return;
    }

    console.debug("[progress-socket]", event);
  };

  log("initializing", { storyId, url });

  const socket = io(url, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 4000,
  });

  handlers.onStatusChange?.("connecting");

  socket.on("connect", () => {
    log("connected", {
      socketId: socket.id,
      transport: socket.io.engine.transport.name,
      connected: socket.connected,
    });
    handlers.onStatusChange?.("connected");
    log("join-story:emit", { storyId, socketId: socket.id });
    socket.emit("join-story", { storyId });
  });

  socket.on("disconnect", (reason) => {
    log("disconnected", {
      socketId: socket.id,
      reason,
      connected: socket.connected,
    });
    handlers.onStatusChange?.("disconnected");
  });

  socket.on("block:analyzed", (event: BlockAnalyzedEvent) => {
    log("block:analyzed", event);
    if (event.storyId === storyId) {
      handlers.onBlockAnalyzed?.(event);
    }
  });

  socket.on("dreamthreads:updated", (event: { storyId: string }) => {
    log("dreamthreads:updated", event);
    if (event.storyId === storyId) {
      handlers.onDreamThreadsUpdated?.(event);
    }
  });

  socket.on("onboarding:complete", (event: { storyId: string }) => {
    log("onboarding:complete", event);
    if (event.storyId === storyId) {
      handlers.onOnboardingComplete?.(event);
    }
  });

  socket.on("scene:content-updated", (event: SceneContentUpdatedEvent) => {
    log("scene:content-updated", event);
    if (event.storyId === storyId) {
      handlers.onSceneContentUpdated?.(event);
    }
  });

  socket.on(
    "storyboard-comment:created",
    (event: { storyId: string; comment: StoryboardCommentEvent }) => {
      log("storyboard-comment:created", event);
      if (event.storyId === storyId) {
        handlers.onStoryboardCommentCreated?.(event);
      }
    }
  );

  socket.on(
    "storyboard-comment:updated",
    (event: { storyId: string; comment: StoryboardCommentEvent }) => {
      log("storyboard-comment:updated", event);
      if (event.storyId === storyId) {
        handlers.onStoryboardCommentUpdated?.(event);
      }
    }
  );

  socket.on(
    "storyboard-comment:deleted",
    (event: StoryboardCommentDeletedEvent) => {
      log("storyboard-comment:deleted", event);
      if (event.storyId === storyId) {
        handlers.onStoryboardCommentDeleted?.(event);
      }
    }
  );

  socket.on(
    "storyboard-comment:resolved",
    (event: { storyId: string; comment: StoryboardCommentEvent }) => {
      log("storyboard-comment:resolved", event);
      if (event.storyId === storyId) {
        handlers.onStoryboardCommentResolved?.(event);
      }
    }
  );

  socket.on(
    "storyboard-comment:reopened",
    (event: { storyId: string; comment: StoryboardCommentEvent }) => {
      log("storyboard-comment:reopened", event);
      if (event.storyId === storyId) {
        handlers.onStoryboardCommentReopened?.(event);
      }
    }
  );

  socket.on("connect_error", (error: Error) => {
    log("connect_error", {
      message: error.message,
      transport: socket.io.engine.transport.name,
      connected: socket.connected,
    });
    handlers.onStatusChange?.("error");
    handlers.onError?.(error.message);
  });

  socket.on("error", (error: Error) => {
    log("socket_error", {
      message: error.message,
      transport: socket.io.engine.transport.name,
    });
  });

  socket.io.on("reconnect_attempt", () => {
    log("reconnect_attempt", {
      attempt: socket.io.engine ? "active" : "unknown",
      transport: socket.io.engine.transport.name,
    });
    handlers.onStatusChange?.("reconnecting");
  });

  socket.io.on("reconnect", () => {
    log("reconnected", {
      socketId: socket.id,
      transport: socket.io.engine.transport.name,
    });
    handlers.onStatusChange?.("connected");
  });

  socket.io.on("reconnect_error", (error: Error) => {
    log("reconnect_error", {
      message: error.message,
      transport: socket.io.engine.transport.name,
    });
  });

  socket.io.on("reconnect_failed", () => {
    log("reconnect_failed");
  });

  socket.io.engine.on("upgrade", () => {
    log("transport_upgrade", {
      transport: socket.io.engine.transport.name,
    });
  });

  return socket;
}
