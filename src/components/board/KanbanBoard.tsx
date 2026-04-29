'use client'

import { useState } from 'react'
import { Task, useTaskStore } from '@/store/task-store'
import { Column } from './Column'

const STATUSES = ['todo', 'in-progress', 'done']

interface KanbanBoardProps {
  tasks: Task[]
}

export function KanbanBoard({ tasks: initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const { reorderTasks } = useTaskStore()

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
    e.preventDefault()

    if (!draggedTaskId) return

    // Find the dragged task
    const draggedTask = tasks.find((t) => t.id === draggedTaskId)
    if (!draggedTask) return

    // Create updated task list
    const updatedTasks = tasks.map((task) => {
      if (task.id === draggedTaskId) {
        return { ...task, status: newStatus, order: 0 }
      }
      return task
    })

    // Recalculate order for the target status
    const tasksInNewStatus = updatedTasks
      .filter((t) => t.status === newStatus)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((task, index) => ({ ...task, order: index }))

    const finalTasks = updatedTasks.map((task) => {
      const updatedTask = tasksInNewStatus.find((t) => t.id === task.id)
      return updatedTask || task
    })

    setTasks(finalTasks)
    setDraggedTaskId(null)

    // Save to API
    await reorderTasks(finalTasks)
  }

  return (
    <div className="flex gap-4 p-6 bg-white rounded-lg overflow-x-auto">
      {STATUSES.map((status) => (
        <Column
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status).sort((a, b) => (a.order || 0) - (b.order || 0))}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
}
