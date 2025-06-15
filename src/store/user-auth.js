import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  fetchCurrentUser: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null, loading: false });
        return;
      }

      const res = await axios.get("/api/v1/users/current-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        set({ user: res.data.user, loading: false });
      } else {
        set({ error: res.data.message, user: null, loading: false });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch user",
        user: null,
        loading: false,
      });
    }
  },

 
}));

export default useAuthStore;
