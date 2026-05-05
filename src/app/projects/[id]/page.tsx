'use client'

import React, { useEffect, useState } from 'react'
import { useProjectsStore } from '@/store/project-store'
import { useTaskStore, Task } from '@/store/task-store'
import { KanbanBoard } from '@/components/board/KanbanBoard'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const projectId = React.use(params).id

  const { projects, fetchProjects } = useProjectsStore()
  const { tasks, fetchTasks, createTask, updateTask, loading, error } = useTaskStore()

  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingTask] = useState<Task | null>(null)

  const project = projects.find((p) => p.id === projectId)

  useEffect(() => {
    if (!projects.length) fetchProjects()
    fetchTasks(projectId)
  }, [projectId, fetchTasks, projects.length, fetchProjects])

  if (!project) {
    return <p className="p-6">Loading project...</p>
  }

  // Create Task
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const title = form.get('title') as string
    const description = form.get('description') as string

    await createTask(projectId, { title, description })
    setOpen(false)
  }

  // Edit Task
  const handleSubmitEditForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const title = form.get('title') as string
    const description = form.get('description') as string

    if (editingTask) {
      await updateTask(editingTask.id, { title, description })
      setOpenEdit(false)
    }
  }

  return (
    <>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <p className="text-gray-600">{project.description || 'No description'}</p>

        <h2 className="text-xl font-medium mt-6">Tasks</h2>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {tasks.length > 0 && <KanbanBoard tasks={tasks} />}

        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
          onClick={() => setOpen(true)}
        >
          Add Task
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="title"
              type="text"
              placeholder="Task title"
              className="w-full border p-2 rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              className="w-full border p-2 rounded"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create
            </button>
            <select name="status" className="w-full border p-2 rounded">
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select name="priority" className="w-full border p-2 rounded">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          {editingTask && (
            <form className="space-y-4" onSubmit={handleSubmitEditForm}>
              <input
                name="title"
                defaultValue={editingTask.title}
                className="w-full border p-2 rounded"
              />
              <textarea
                name="description"
                defaultValue={editingTask.description || ''}
                className="w-full border p-2 rounded"
              />
              <select
                name="status"
                defaultValue={editingTask.status}
                className="w-full border p-2 rounded"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <select
                name="priority"
                defaultValue={editingTask.priority}
                className="w-full border p-2 rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
