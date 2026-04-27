'use client'

import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export type Task = {
  id: string
  description?: string | null
  projectId: string
  title: string
  status: string
  createdAt: string
}

type State = {
  tasks: Task[]
  loading: boolean
  error: string | null


  updateTask: (id: string, data: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  fetchTasks: (projectId: string) => Promise<void>
  createTask: (
    projectId: string,
    data: {title: string, description?: string}
  ) => Promise<void>
}

export const useTaskStore = create<State>((set, get) => ({
  tasks: [],
  loading: false,
  error: null

  fetchTasks: async (projectId) => {
    set({loading: true, error: null})

    try{
    const res = await fetch(`${API_URL}/projects/${projectId}/tasks`)
    const data = await res.json()

    set({ tasks: data, loading: false })
      } catch (err){
      set({error: 'Failed to load tasks', loading: false})
    }
  },

  createTask: async (projectId, payload) => {
    set({loading: true, error: null})

   try { const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...payload, projectId}),
    })

    const newTask = await res.json()

    set({tasks: [...get().tasks, newTask], loading: false})}
    catch(err){
      set({error: 'Failed to create task', loading: false})
    }
  },


  updateTask: async (id, payload) => {
    set({loading: true, error: null})

    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const updated = await res.json()

    set({ get().tasks.map((t) => (t.id === id ? updated : t)),
   })
  },

  deleteTask: async (id) => {
    set({loading: true, error: null})

   try{ await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })

    set( {get().tasks.filter((t) => t.id !== id),
    })} catch (err) {
      set({error: 'Failed to delete task', loading: false})
   }
  },
}))
