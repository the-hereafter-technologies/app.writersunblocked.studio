import { Label } from "@/components/Label";
import { Caption, TextField } from "@writersunblocked/ui/app";
import { useCallback, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export const UserOnboardingHandle = () => {
  const [isHandleAvailable, setHandleAvailable] = useState<boolean | null>(
    null
  );
  const { setValue } = useFormContext();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (value?: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        if (!value) {
          setHandleAvailable(null);
          return;
        }

        const res = await fetch(
          `/api/users/handle-availability?handle=${encodeURIComponent(value)}`
        );
        const data = (await res.json()) as { available: boolean };
        setHandleAvailable(data.available);
        setValue("handle", value);
      }, 400);
    },
    [setValue]
  );

  return (
    <div className="input-container">
      <Label>Choose a handle</Label>
      <div className="with-handle-check">
        <TextField
          name="handle"
          className="text-field"
          placeholder="Your unique handle (i.e., @thewritingchampion74)"
          onChange={handleChange}
        />
        <div className="is-available">
          <span
            className={
              isHandleAvailable === null
                ? ""
                : isHandleAvailable
                  ? "available"
                  : "unavailable"
            }
          />
        </div>
      </div>
      <Caption text="Used for your profile and community visibility." />
    </div>
  );
};
