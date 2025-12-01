import { create } from "zustand";

type MiniCartStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useMiniCartStore = create<MiniCartStore>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));
