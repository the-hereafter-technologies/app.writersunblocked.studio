import { NestApiError, nestApiRequest } from "@/lib/nest-api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Styled from "./style";

export const DeleteProject = ({
  storyId,
  onClose,
}: {
  storyId: string;
  onClose: () => void;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await nestApiRequest({
        path: `/stories/${storyId}`,
        method: "DELETE",
      });
      onClose();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof NestApiError
          ? err.message
          : "Could not delete this project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Styled.DeleteProjectContainer>
      <h2>Are you sure you want to delete this project?</h2>
      <p>This action cannot be undone.</p>
      {error ? <p>{error}</p> : null}
      <button type="button" onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete"}
      </button>
      <button type="button" onClick={handleCancel} disabled={loading}>
        Cancel
      </button>
    </Styled.DeleteProjectContainer>
  );
};
