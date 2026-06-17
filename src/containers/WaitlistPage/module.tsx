import Link from "next/link";
import * as Style from "./style";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Suspense } from "react";
import { DemoImage } from "./demo-image";

/**
 * WaitlistPage description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered WaitlistPage component.
 */
export const WaitlistPage = () => {
  return (
    <Style.Container>
      <header>writersunblocked.studio&#8480;</header>
      <div>
        <h1>
          Get your <em>story</em> unblocked. <br />
          Not a better sentence. A fuller world.
        </h1>
        <h2>
          A new kind of writing tool — one that reads the world you've built and
          shows you what it's already telling you. Join the waitlist for early
          access.
        </h2>
      </div>
      <Style.SignUpForWaitlist />
      <DemoImage />
      <div>
        <ul>
          <li>
            <h3>World Mapping</h3>
            <p>
              As you write, your story's world takes shape — characters,
              locations, timelines, how they connect.{" "}
              <strong>
                See the structure behind the words, as you build it.
              </strong>
            </p>
          </li>
          <li>
            <h3>Scene continuity</h3>
            <p>
              Every scene checked against everything that came before it.{" "}
              <strong>Catch what slips through before your editor does.</strong>
            </p>
          </li>
          <li>
            <h3>Path Suggestions</h3>
            <p>
              When you're stuck, we surface directions drawn from the tensions
              and threads already in your manuscript.{" "}
              <strong>
                Not random prompts. Your story's own logic, made visible.
              </strong>
            </p>
          </li>
        </ul>
      </div>
      <footer>
        <div>
          <span>
            &copy; {new Date().getFullYear()} The Hereafter Technologies, Inc.
          </span>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <div className="login">
          Early access users can <Link href="/login">log in here.</Link>
        </div>
      </footer>
    </Style.Container>
  );
};
