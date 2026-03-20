import { create } from "zustand";

type CartState = {
  count: number;
  setCount: (count: number) => void;
  increment: () => void;
  reset: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}));
