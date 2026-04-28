'use client'

import { create } from 'zustand'

// === TF CLEANUP START (Copilot) ===
// Исправлено:
// 1) id → number (соответствует Prisma)
// 2) убран createdAt (его нет в схеме)
// 3) добавлена защита API_URL
// 4) единое имя стора: useProjectsStore
// 5) улучшена обработка ошибок
// === TF CLEANUP END (Copilot) ===

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4800'

type Project = {
  id: number
  title: string
  description?: string | null
}

type State = {
  projects: Project[]
  loading: boolean
  error: string | null

  fetchProjects: () => Promise<void>
  createProject: (data: { title: string; description?: string }) => Promise<void>
}

export const useProjectsStore = create<State>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/projects`)
      const data = await res.json()

      set({ projects: data, loading: false })
    } catch (err) {
      console.error(err)
      set({ error: 'Failed to load projects', loading: false })
    }
  },

  createProject: async (payload) => {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const newProject = await res.json()

      set({
        projects: [...get().projects, newProject],
        loading: false,
      })
    } catch (err) {
      console.error(err)
      set({ error: 'Failed to create project', loading: false })
    }
  },
}))
