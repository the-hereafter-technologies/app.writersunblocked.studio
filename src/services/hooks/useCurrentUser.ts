"use client";

import { useCallback, useEffect, useState } from "react";
import { nestApiRequest } from "@/lib/nest-api";
import type { MeUser } from "@/services/api/getMe";

export interface UseCurrentUserResult {
  user: MeUser | null;
  stories: any[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<MeUser | null>;
}

export const useCurrentUser = (): UseCurrentUserResult => {
  const [user, setUser] = useState<MeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stories, setStories] = useState<any[]>([]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const me = await nestApiRequest<MeUser>({
        path: "/users/me",
        cache: "no-store",
      });
      const stories = await nestApiRequest<any[]>({ path: "/stories" });
      setStories(stories);
      setUser(me);
      return me;
    } catch (caughtError) {
      const typedError =
        caughtError instanceof Error
          ? caughtError
          : new Error("Failed to fetch current user");
      setUser(null);
      setError(typedError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    user,
    stories,
    isLoading,
    error,
    refetch,
  };
};
