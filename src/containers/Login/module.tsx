import { getMarketingUrl } from "@/lib/marketing-url";
import Image from "next/image";
import Link from "next/link";
import LoginImage from "./image.png";
import { LoginForm } from "./login-form";
import { LoginWithGoogle } from "./login-with-google";
import * as Style from "./style";

export interface LoginProps {
  error?: string;
}

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  no_account:
    "We couldn't find an account for that Google sign-in. Create an account on our website first, then come back to log in.",
};

function getLoginErrorMessage(error?: string): string | null {
  if (!error) {
    return null;
  }

  return LOGIN_ERROR_MESSAGES[error] ?? "Unable to sign in. Please try again.";
}

/**
 * Login description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered Login component.
 */
export const Login = ({ error }: LoginProps) => {
  const errorMessage = getLoginErrorMessage(error);
  const marketingUrl = getMarketingUrl();

  const toTheUser = [
    "Let's get you back to your stories.",
    "100 words today and you get a biggg hug!",
    "Keep up the great work!",
  ];

  const randomMessage = toTheUser[Math.floor(Math.random() * toTheUser.length)];

  return (
    <Style.Container>
      <div>
        <div className="header">
          Welcome back
          <span>{randomMessage}</span>
        </div>
        {errorMessage ? (
          <div className="login-error" role="alert">
            {errorMessage}
          </div>
        ) : null}

        <div>
          <LoginForm />
        </div>
        <div className="login-with">
          <span>Or continue with...</span>
          <LoginWithGoogle />
        </div>
        <div style={{ marginTop: "1.25rem", fontSize: "14px" }}>
          Don&apos;t have an account?{" "}
          <Link
            href={`${marketingUrl}/signup`}
            style={{ textDecoration: "underline" }}
          >
            Sign up on writersunblocked.studio
          </Link>
        </div>
      </div>
      <div>
        <Image src={LoginImage} alt="Login" />
      </div>
    </Style.Container>
  );
};
