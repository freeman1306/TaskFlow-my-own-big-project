'use client'

import { useTaskStore } from '@/store/task-store'
import { useEffect, useState } from 'react'

// === TF CLEANUP START (Copilot) ===
// Страница /tasks пока не реализована в API.
// Убираем вызовы fetchTasks(), чтобы не ломать проект.
// Добавляем временный placeholder до этапа TF‑6.x.
// === TF CLEANUP END (Copilot) ===

export default function TasksPage() {
  const { tasks, fetchAllTasks, loading } = useTaskStore()

  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    fetchAllTasks()
  }, [])

  const filtered = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    return true
  })

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">All Tasks</h1>

      <div className="flex gap-4">
        <select className="border p-2 rounded" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          className="border p-2 rounded"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}

      <div className="space-y-2">
        {filtered.map((t) => (
          <div key={t.id} className="border p-4 rounded">
            <h3 className="text-lg">{t.title}</h3>
            <p>Status: {t.status}</p>
            <p>Priority: {t.priority}</p>
            <p className="text-gray-600 text-sm">{t.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
