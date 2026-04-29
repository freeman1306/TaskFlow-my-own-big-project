'use client'

import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export type Task = {
  id: string
  description?: string | null
  projectId: string
  title: string
  status: string
  priority?: string
  order?: number
  createdAt: string
}

type State = {
  tasks: Task[]
  loading: boolean
  error: string | null

  fetchTasks: (projectId: string) => Promise<void>
  createTask: (projectId: string, data: { title: string; description?: string }) => Promise<void>
  updateTask: (id: string, data: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  reorderTasks: (tasks: Task[]) => Promise<void>
}

export const useTaskStore = create<State>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (projectId: string) => {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/tasks`)
      const data = await res.json()

      set({ tasks: data, loading: false })
    } catch {
      set({ error: 'Failed to load tasks', loading: false })
    }
  },

  createTask: async (projectId: string, payload: { title: string; description?: string }) => {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, projectId }),
      })

      const newTask = await res.json()

      set({ tasks: [...get().tasks, newTask], loading: false })
    } catch {
      set({ error: 'Failed to create task', loading: false })
    }
  },


  updateTask: async (id: string, payload: Partial<Task>) => {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const updated = await res.json()

      set({ tasks: get().tasks.map((t: Task) => (t.id === id ? updated : t)), loading: false })
    } catch {
      set({ error: 'Failed to update task', loading: false })
    }
  },

  deleteTask: async (id: string) => {
    set({ loading: true, error: null })

    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })

      set({ tasks: get().tasks.filter((t: Task) => t.id !== id), loading: false })
    } catch {
      set({ error: 'Failed to delete task', loading: false })
    }
  },

  reorderTasks: async (tasks: Task[]) => {
    try {
      const res = await fetch(`${API_URL}/tasks/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      })

      const updated = await res.json()
      set({ tasks: updated })
    } catch {
      set({ error: 'Failed to reorder tasks' })
    }
  },
}))
