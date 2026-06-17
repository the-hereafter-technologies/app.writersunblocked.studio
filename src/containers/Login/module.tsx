import Image from "next/image";
import Link from "next/link";
import LoginImage from "./image.png";
import { LoginForm } from "./login-form";
import { LoginWithGoogle } from "./login-with-google";
import * as Style from "./style";

export interface LoginProps {
  referral?: string;
}

/**
 * Login description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered Login component.
 */
export const Login = ({ referral: _referral }: LoginProps) => {
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
        <div className="disabled-disclaimed">
          Email login is temporarily disabled during our early access period.
          Please continue with your google account by clicking the button below.
        </div>
        <div>
          <LoginForm />
        </div>
        <div className="login-with">
          <span>Or continue with...</span>
          <LoginWithGoogle mode="login" />
        </div>
        <div style={{ marginTop: "1.25rem", fontSize: "14px" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ textDecoration: "underline" }}>
            Sign up here
          </Link>
        </div>
      </div>
      <div>
        <Image src={LoginImage} alt="Login" />
      </div>
    </Style.Container>
  );
};
