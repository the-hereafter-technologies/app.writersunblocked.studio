import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import * as Style from "./style";

export interface ContextProps {
  currentPage: number;
  nextPage: () => void;
  prevPage: () => void;
  totalPages: number;
}

export const OnboardingPageCarouselContext = createContext<
  ContextProps | undefined
>(undefined);

export const useOnboardingPageCarousel = () => {
  const context = useContext(OnboardingPageCarouselContext);
  if (!context) {
    throw new Error(
      "useOnboardingPageCarousel must be used within an OnboardingPageCarouselProvider"
    );
  }
  return context;
};

export interface OnboardingPageCarouselProviderProps {
  children: React.ReactNode;
  totalPages: number;
  onboardingId: string;
}

export const OnboardingPageCarouselProvider = ({
  children,
  totalPages,
  onboardingId,
}: OnboardingPageCarouselProviderProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevSlide = useRef<number>(0);

  useLayoutEffect(() => {
    const handleResize = () => {
      const slide = document.querySelector<HTMLElement>(".slide");
      if (slide) {
        setSlideWidth(slide.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextPage = useCallback(() => {
    // if is last slide do nothing
    if (currentPage + 1 >= totalPages) {
      return;
    }

    setIsUpdating(true);
    if (railRef.current) {
      railRef.current.style.transform = `translateX(-${(currentPage + 1) * slideWidth}px)`;
    }
    setCurrentPage((prev) => prev + 1);
    setTimeout(() => {
      setIsUpdating(false);
      prevSlide.current = currentPage;
    }, 300);
  }, [currentPage, slideWidth, totalPages]);

  const prevPage = useCallback(() => {
    // if is first slide do nothing
    if (currentPage - 1 < 0) {
      return;
    }

    setIsUpdating(true);
    if (railRef.current) {
      railRef.current.style.transform = `translateX(-${(currentPage - 1) * slideWidth}px)`;
    }
    setCurrentPage((prev) => prev - 1);
    setTimeout(() => {
      setIsUpdating(false);
      prevSlide.current = currentPage;
    }, 300);
  }, [currentPage, slideWidth]);

  return (
    <OnboardingPageCarouselContext.Provider
      value={{ currentPage, nextPage, prevPage, totalPages }}
    >
      <Style.Rail ref={railRef}>{children}</Style.Rail>
    </OnboardingPageCarouselContext.Provider>
  );
};
