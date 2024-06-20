import { create } from "zustand";

const useAuthStore = create((set) => ({
  id: "",
  email: "",
  full_name: "",
  is_admin: false,
  token: "",
  isLoading: true,

  setUser: (newUser) => set({ ...newUser, isLoading: false }),
  resetUser: () =>
    set({
      id: "",
      email: "",
      full_name: "",
      is_admin: false,
      token: "",
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
