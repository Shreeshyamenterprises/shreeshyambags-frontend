import { create } from "zustand";
import { getToken, setToken as saveToken, removeToken } from "@/lib/auth";

type AuthState = {
  token: string | null;
  loggedIn: boolean;
  load: () => void;
  login: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  loggedIn: false,

  load: () => {
    const token = getToken();
    set({
      token,
      loggedIn: !!token,
    });
  },

  login: (token: string) => {
    saveToken(token);
    set({
      token,
      loggedIn: true,
    });
  },

  logout: () => {
    removeToken();
    set({
      token: null,
      loggedIn: false,
    });
  },
}));
