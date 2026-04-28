'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { useProjectsStore } from '@/store/project-store'
import { useTaskStore, Task } from '@/store/task-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const projectId = Number(id)

  if (!id || isNaN(projectId)) {
    console.warn('Invalid projectId:', id)
    return <p className="p-6 text-red-600">Invalid project URL</p>
  }

  const { projects, fetchProjects } = useProjectsStore()
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, loading, error } = useTaskStore()

  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_desc')

  const filtered = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'created_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'created_desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'priority_asc':
        return a.priority.localeCompare(b.priority)
      case 'priority_desc':
        return b.priority.localeCompare(a.priority)
      case 'status_asc':
        return a.status.localeCompare(b.status)
      case 'status_desc':
        return b.status.localeCompare(a.status)
      default:
        return 0
    }
  })

  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const project = projects.find((p) => p.id === projectId)

  useEffect(() => {
    if (!projects.length) fetchProjects()
    if (!isNaN(projectId)) fetchTasks(projectId)
  }, [projectId])

  if (isNaN(projectId)) {
    return <p className="p-6 text-red-600">Invalid project ID</p>
  }

  if (!project) {
    return <p className="p-6">Loading project...</p>
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const title = (form.get('title') as string).trim()
    const description = (form.get('description') as string)?.trim() || null

    if (!title) return

    await createTask(projectId, { title, description })
    setOpen(false)
  }

  const handleSubmitEditForm = async (e: any) => {
    e.preventDefault()
    if (!editingTask) return

    const form = new FormData(e.target)
    const title = (form.get('title') as string).trim()
    const description = (form.get('description') as string)?.trim() || null

    await updateTask(editingTask.id, { title, description })
    setOpenEdit(false)
  }

  return (
    <>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <p className="text-gray-600">{project.description || 'No description'}</p>

        <h2 className="text-xl font-medium mt-6">Tasks</h2>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <select className="border p-2 rounded" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="created_desc">Newest first</option>
          <option value="created_asc">Oldest first</option>
          <option value="priority_desc">Priority high → low</option>
          <option value="priority_asc">Priority low → high</option>
          <option value="status_asc">Status A → Z</option>
          <option value="status_desc">Status Z → A</option>
        </select>

        <div className="space-y-2">
          {filtered.map((t) => (
            <div key={t.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="text-lg">{t.title}</h3>
                {t.description && <p className="text-gray-600">{t.description}</p>}
                <p className="text-gray-600">Status: {t.status}</p>
                <p className="text-gray-600">Priority: {t.priority}</p>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => {
                    setEditingTask(t)
                    setOpenEdit(true)
                  }}
                >
                  Edit
                </button>

                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => deleteTask(t.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

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
            <input name="title" type="text" placeholder="Task title" className="w-full border p-2 rounded" />
            <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" />

            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
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
              <input name="title" defaultValue={editingTask.title} className="w-full border p-2 rounded" />
              <textarea
                name="description"
                defaultValue={editingTask.description || ''}
                className="w-full border p-2 rounded"
              />
              <select name="status" defaultValue={editingTask.status} className="w-full border p-2 rounded">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <select name="priority" defaultValue={editingTask.priority} className="w-full border p-2 rounded">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Save
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
