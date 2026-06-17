"use client";
import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import * as Style from "./style";
import { ModalContext } from "./utils";

type Window = React.ReactNode;

export type ModalProps = {};

/**
 * Modal description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered Modal component.
 */
export const Modal = ({ children }: PropsWithChildren<ModalProps>) => {
  const [open, setIsOpen] = useState(false);
  const [modalWindow, setModalWindowState] = useState<Window | null>(null);
  const [scrim, setScrim] = useState(true);

  const setModalWindow = (
    nextWindow: Window | null,
    options?: { scrim?: boolean }
  ) => {
    setModalWindowState(nextWindow);
    setScrim(options?.scrim ?? true);
  };

  const openModal = (window: Window | null, options?: { scrim?: boolean }) => {
    setModalWindow(window, options);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const isOpen = useMemo(
    () => modalWindow !== null && open,
    [modalWindow, open]
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ setModalWindow, openModal, closeModal }}>
      {children}
      {isOpen && <Style.Container open={open}>{modalWindow}</Style.Container>}
      {isOpen && scrim && <Style.Scrim onClick={closeModal} />}
    </ModalContext.Provider>
  );
};
