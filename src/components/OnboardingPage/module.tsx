"use client";
import { useCheckout } from "@/services/hooks/useCheckout";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "next/navigation";
import { Children, type ComponentProps, Fragment, useCallback } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import type { InferType } from "yup";
import { OnboardingPageCarouselProvider } from "./provider";
import * as Style from "./style";

export interface OnboardingPageProps extends ComponentProps<"form"> {
  schema: any;
  defaultValues?: any;
  onComplete?: (
    data: any,
    selectedOfferId: string | null
  ) => Promise<void> | void;
}

/**
 * OnboardingPage description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered OnboardingPage component.
 */
export const OnboardingPage = ({
  children,
  schema,
  defaultValues,
  onComplete,
  ...props
}: OnboardingPageProps) => {
  const params = useParams();
  const onboardingId = params.onboardingId;
  console.log("Onboarding ID:", onboardingId);

  const { offers } = useCheckout();

  const Slides = Children.toArray(children);

  // isValidSlide checks if the components name is OnboardingSection
  const isValidSlide = (slide: any) => {
    return slide && (slide as any).type?.displayName === "OnboardingSection";
  };

  const validSlides = Slides.filter(isValidSlide);

  const addOrderProp = useCallback((slide: any, order: number) => {
    return {
      ...slide,
      props: {
        ...slide.props,
        order,
      },
    };
  }, []);
  const slidesWithOrder = validSlides.map((slide, index) =>
    addOrderProp(slide, index + 1)
  );

  // +1 to account for the UpgradeForAccess slide at the end
  const totalPages = slidesWithOrder.length + 1;

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleUpgrade = useCallback(
    (offerId: string) => {
      void methods.handleSubmit((data) => onComplete?.(data, offerId))();
    },
    [methods, onComplete]
  );

  const handleContinueFree = useCallback(() => {
    void methods.handleSubmit((data) => onComplete?.(data, null))();
  }, [methods, onComplete]);

  const onSubmit: SubmitHandler<InferType<typeof schema>> = useCallback(
    (_data) => {},
    []
  );

  return (
    <FormProvider {...methods}>
      <Style.Container onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        <OnboardingPageCarouselProvider
          totalPages={totalPages}
          onboardingId={onboardingId as string}
        >
          {slidesWithOrder.map((slide) => (
            <Fragment key={slide.props.order}>{slide}</Fragment>
          ))}
        </OnboardingPageCarouselProvider>
      </Style.Container>
    </FormProvider>
  );
};
