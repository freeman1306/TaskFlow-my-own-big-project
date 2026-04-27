'use client'

import { useTaskStore } from '@/store/task-store'
import { useEffect } from 'react'

export default function TasksPage() {
  const { tasks, loading, fetchTasks } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">All Tasks</h1>

      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className="border p-4 rounded">
            <h2 className="text-lg font-medium">{t.title}</h2>
            <p>Status: {t.status}</p>
            <p>Priority: {t.priority}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
