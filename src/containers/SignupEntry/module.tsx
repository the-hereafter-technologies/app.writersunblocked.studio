import Image from "next/image";
import Link from "next/link";
import LoginImage from "../Login/image.png";
import { LoginForm } from "../Login/login-form";
import { LoginWithGoogle } from "../Login/login-with-google";
import * as Style from "../Login/style";

export const SignupEntry = ({ referral: _referral }: { referral?: string }) => {
  const toTheUser = [
    "Start your first story with a single click.",
    "Your writing habit starts right here.",
    "Claim your writing space and begin.",
  ];

  const randomMessage = toTheUser[Math.floor(Math.random() * toTheUser.length)];

  return (
    <Style.Container>
      <div>
        <div className="header">
          Create your account
          <span>{randomMessage}</span>
        </div>
        <div className="disabled-disclaimed">
          Email signup is temporarily disabled during our early access period.
          Please continue with your google account by clicking the button below.
        </div>
        <div>
          <LoginForm />
        </div>
        <div className="login-with">
          <span>Or continue with...</span>
          <LoginWithGoogle mode="signup" />
        </div>
        <div style={{ marginTop: "1.25rem", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ textDecoration: "underline" }}>
            Log in here
          </Link>
        </div>
      </div>
      <div>
        <Image src={LoginImage} alt="Sign up" />
      </div>
    </Style.Container>
  );
};
