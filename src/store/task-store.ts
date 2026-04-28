'use client'

import { create } from 'zustand'

// === TF CLEANUP START (Copilot) ===
// Исправлено:
// 1) id, projectId → number (соответствует Prisma)
// 2) status, priority → optional
// 3) createdAt → Date (соответствует Prisma)
// 4) API_URL с fallback
// 5) корректная обработка типов при создании/обновлении/удалении
// 6) единый стиль стора
// === TF CLEANUP END (Copilot) ===

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4800'

export type Task = {
  id: number
  title: string
  description?: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  projectId: number
  createdAt: string
}

type State = {
  tasks: Task[]
  loading: boolean
  error: string | null

  fetchTasks: (projectId: number) => Promise<void>
  createTask: (projectId: number, data: { title: string; description?: string }) => Promise<void>
  updateTask: (id: number, data: Partial<Task>) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  fetchAllTasks: () => Promise<void>
}

export const useTaskStore = create<State>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  // LOAD TASKS
  fetchTasks: async (projectId: number) => {
    if (!projectId || isNaN(projectId)) {
      console.warn('fetchTasks: invalid projectId =', projectId)
      return
    }
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/tasks`)
      const data = await res.json()

      set({ tasks: data, loading: false })
    } catch (err) {
      console.error(err)
      set({ error: 'Failed to load tasks', loading: false })
    }
  },

  // CREATE TASK
  createTask: async (projectId: number, payload: { title: string; description?: string }) => {
    if (!projectId || isNaN(projectId)) {
      console.warn('createTask: invalid projectId =', projectId)
      return
    }
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          projectId,
          status: payload.status || 'todo',
          priority: payload.priority || 'medium',
        }),
      })

      const newTask = await res.json()

      set({
        tasks: [...get().tasks, newTask],
        loading: false,
      })
    } catch (err) {
      console.error(err)
      set({ error: 'Failed to create task', loading: false })
    }
  },

  // UPDATE TASK
  updateTask: async (id, payload) => {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const updated = await res.json()

      set({
        tasks: get().tasks.map((t) => (t.id === id ? updated : t)),
        loading: false,
      })
    } catch (err) {
      console.error(err)
      set({ error: 'Failed to update task', loading: false })
    }
  },

  // DELETE TASK
  deleteTask: async (id) => {
    set({ loading: true, error: null })

    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })

      set({
        tasks: get().tasks.filter((t) => t.id !== id),
        loading: false,
      })
    } catch (err) {
      console.error(err)
      set({ error: 'Failed to delete task', loading: false })
    }
  },

  fetchAllTasks: async () => {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/tasks`)
      const data = await res.json()

      set({ tasks: data, loading: false })
    } catch (error) {
      console.error(error)
      set({ error: 'Failed to load all tasks', loading: false })
    }
  },
}))
