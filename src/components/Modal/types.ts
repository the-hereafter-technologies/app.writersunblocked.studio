export interface ModalContextValue {
  openModal: (
    window: React.ReactNode | null,
    options?: { scrim?: boolean }
  ) => void;
  closeModal: () => void;
  setModalWindow: (
    window: React.ReactNode | null,
    options?: { scrim?: boolean }
  ) => void;
}
