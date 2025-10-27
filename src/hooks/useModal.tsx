import { useState, ReactNode, useCallback } from "react";

interface ModalState {
  isOpen: boolean;
  content: ReactNode | null;
}

export function useModal() {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    content: null,
  });

  const openModal = useCallback((content: ReactNode) => {
    setModal({ isOpen: true, content });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, content: null });
  }, []);

  return {
    ...modal,
    openModal,
    closeModal,
  };
}
