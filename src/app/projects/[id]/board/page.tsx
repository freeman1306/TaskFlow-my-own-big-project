'use client'

import { Column } from '@/components/Column'
import { useTaskStore } from '@/store/task-store'
import { use, useEffect } from 'react'

export default function BoardPage({ params }) {
  const { id } = use(params)
  const projectId = Number(id)

  const { tasks, fetchTasks, updateTask } = useTaskStore()

  useEffect(() => {
    fetchTasks(projectId)
  }, [projectId])

  const onDropTask = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus })
  }

  const columns = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {Object.entries(columns).map(([status, list]) => (
        <Column key={status} status={status} tasks={list} onDropTask={onDropTask} />
      ))}
    </div>
  )
}
