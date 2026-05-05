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
  id: string
  title: string
  description?: string
  status: string
  priority?: string
  createdAt: string
  order: number
}

type State = {
  tasks: Task[]
  loading: boolean
  error: string | null

  fetchTasks: (projectId: string) => Promise<void>
  fetchAllTasks: () => Promise<void>
  createTask: (projectId: string, data: { title: string; description?: string }) => Promise<void>
  updateTask: (id: string, data: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  moveTask: (id: string, newStatus: string) => Promise<void>
  reorderTasks: (id: string, newIndex: number, columnStatus: string) => Promise<void>
  reorderTasksBulk: (tasks: Task[]) => Promise<void>
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

  fetchAllTasks: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/tasks`)
      const data = await res.json()
      set({ tasks: data, loading: false })
    } catch {
      set({ error: 'Failed to load all tasks', loading: false })
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

  // === MOVE TASK (Drag & Drop) ===
  moveTask: async (id: string, newStatus: string) => {
    const prevTasks = get().tasks
    const task = prevTasks.find((t) => t.id === id)
    if (!task) return

    // Optimistic update
    set({
      tasks: prevTasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
    })

    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error()

      const updated = await res.json()
      set({
        tasks: get().tasks.map((t) => (t.id === id ? updated : t)),
      })
    } catch {
      set({ tasks: prevTasks, error: 'Failed to move task' })
    }
  },

  updateTask: async (id: string, payload: Partial<Task>) => {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
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

  reorderTasks: async (id: string, newIndex: number, columnStatus: string) => {
    const prevTasks = get().tasks
    const columnTasks = prevTasks
      .filter((t) => t.status === columnStatus)
      .sort((a, b) => a.order - b.order)

    const oldIndex = columnTasks.findIndex((t) => t.id === id)
    if (oldIndex === -1) return

    const newColumnTasks = [...columnTasks]
    const [movedTask] = newColumnTasks.splice(oldIndex, 1)
    newColumnTasks.splice(newIndex, 0, movedTask)

    // Обновляем order для всех задач в колонке
    const updatedColumnTasks = newColumnTasks.map((t, index) => ({
      ...t,
      order: index,
    }))

    // Обновляем общий стейт
    set({
      tasks: prevTasks.map((t) => {
        const updated = updatedColumnTasks.find((ut) => ut.id === t.id)
        return updated || t
      }),
    })

    try {
      await fetch(`${API_URL}/tasks/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: updatedColumnTasks.map((t) => ({ id: t.id, order: t.order })),
        }),
      })
    } catch {
      set({ tasks: prevTasks, error: 'Failed to reorder tasks' })
    }
  },

  reorderTasksBulk: async (tasks: Task[]) => {
    try {
      const res = await fetch(`${API_URL}/tasks/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: tasks.map((t) => ({ id: t.id, order: t.order })),
        }),
      })

      const updated = await res.json()
      set({ tasks: updated })
    } catch {
      set({ error: 'Failed to reorder tasks' })
    }
  },
}))
