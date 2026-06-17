"use client";
import { useEffect, useState } from "react";
import DesktopImage from "./demo-desktop.png";
import MobileImage from "./image.png";
import Image from "next/image";
import * as Styled from "./style";

export const DemoImage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Styled.DemoImageItem
      src={isMobile ? MobileImage : DesktopImage}
      loading="eager"
      alt="Illustration"
    />
  );
};
