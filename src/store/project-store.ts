'use client'

import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL

type Project = {
  id: string
  title: string
  description?: string | null
  createdAt: string
}

type State = {
  projects: Project[]
  loading: boolean
  error: string | null

  fetchProjects: () => Promise<void>
  createProject: (data: { title: string; description?: string }) => Promise<void>
}

export const useProjectStore = create<State>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/projects`)
      const data = await res.json()

      set({ projects: data, loading: false })
    } catch {
      set({ error: 'Failed to load projects', loading: false })
    }
  },

  createProject: async (payload: { title: string; description?: string }) => {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const newProject = await res.json()

      set({ projects: [...get().projects, newProject], loading: false })
    } catch {
      set({ error: 'Failed to create project', loading: false })
    }
  },
}))
