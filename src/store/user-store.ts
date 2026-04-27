import { create } from 'zustand'

type User = {
  email: string | null
}

type UserStore = {
  user: User
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: { email: null },

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: { email: null } }),
}))
