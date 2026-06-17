"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { nestApiRequest } from "@/lib/nest-api";

export default function NewStoryButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createStory = async () => {
    setLoading(true);
    try {
      const story = await nestApiRequest<{ id: string }>({
        path: "/stories",
        method: "POST",
      });
      if (story.id) {
        router.push(`/story/${story.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="accent"
      onClick={createStory}
      loading={loading}
      label="New Story"
    >
      New Story
    </Button>
  );
}
