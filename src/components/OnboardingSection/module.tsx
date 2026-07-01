"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../Button";
import { useOnboardingPageCarousel } from "../OnboardingPage/provider";
import * as Style from "./style";

export interface OnboardingSectionProps {
  title?: string;
  subtitle?: string;
  order?: number;
  route?: string;
  children?: React.ReactNode;
  validateBeforeContinue?: string[];
}

/**
 * OnboardingSection description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered OnboardingSection component.
 */
export const OnboardingSection = Object.assign(
  ({
    title,
    subtitle,
    order,
    children,
    validateBeforeContinue,
  }: OnboardingSectionProps) => {
    const { currentPage, nextPage, prevPage, totalPages } =
      useOnboardingPageCarousel();

    const {
      trigger,
      formState: { errors },
    } = useFormContext();

    const isCurrentPage = useMemo(
      () => order === currentPage + 1,
      [order, currentPage]
    );

    const isFirstPage = useMemo(() => order === 1, [order]);
    const isLastSlide = useMemo(
      () => order === totalPages - 2,
      [order, totalPages]
    );
    const isLastPage = useMemo(
      () => order === totalPages - 1,
      [totalPages, order]
    );

    const handleNextPage = useCallback(async () => {
      if (validateBeforeContinue) {
        const isValid = await trigger(validateBeforeContinue);
        if (!isValid) return;
      }
      nextPage();
    }, [nextPage, validateBeforeContinue, trigger]);

    const handlePrevPage = useCallback(() => {
      prevPage();
    }, [prevPage]);

    const errorMessage = useMemo(() => {
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0];
        return errors[firstErrorKey]?.message as string;
      }
      return null;
    }, [errors]);

    const showCover = useMemo(() => {
      if (isCurrentPage) return false;
      if (isLastPage) return false;
      return true;
    }, [isCurrentPage, isLastPage]);

    const showContinue = useMemo(() => {
      if (!isCurrentPage) return false;
      if (isLastSlide) return false;
      return true;
    }, [isLastSlide, isCurrentPage]);

    return (
      <AnimatePresence>
        <Style.Container className="slide">
          <Style.Header>
            {isCurrentPage && (
              <>
                <Style.Title>{title}</Style.Title>
                <Style.Subtitle>{subtitle}</Style.Subtitle>
              </>
            )}
          </Style.Header>
          <Style.Card
            style={
              isLastPage ? { padding: 0, backgroundColor: "transparent" } : {}
            }
          >
            <Style.CardContent>{children}</Style.CardContent>
            {showCover && <Style.CardCover />}
          </Style.Card>
          <Style.Footer>
            <Style.FooterActions>
              {!isFirstPage && isCurrentPage && (
                <Button label="Back" onClick={handlePrevPage} />
              )}
              {showContinue && (
                <Button label="Continue" arrow onClick={handleNextPage} />
              )}
            </Style.FooterActions>
            {errorMessage && (
              <Style.ErrorMessage>{errorMessage}</Style.ErrorMessage>
            )}
          </Style.Footer>
        </Style.Container>
      </AnimatePresence>
    );
  },
  { displayName: "OnboardingSection" }
);
