'use client'

import { useEffect, useState } from 'react'
import { useProjectStore } from '@/store/project-store'
import { useTaskStore, Task } from '@/store/task-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ProjectPage({ params }: { params: { id: string } }) {
  const projectId = params.id

  const { projects, fetchProjects } = useProjectStore()
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, loading, error } = useTaskStore()

  // UI state
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const project = projects.find((p) => p.id === projectId)

  useEffect(() => {
    if (!projects.length) fetchProjects()
    fetchTasks(projectId)
  }, [projectId, fetchProjects, fetchTasks])

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

  if (!project) return <p className="p-6">Loading project...</p>

  return (
    <>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <p className="text-gray-600">{project.description}</p>

        <h2 className="text-xl font-medium mt-6">Tasks</h2>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-2">
          {tasks.map((t: Task) => (
            <div key={t.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="text-lg">{t.title}</h3>
                <p>Status: {t.status}</p>
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

        {/* Add Task Button */}
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
          onClick={() => setOpen(true)}
        >
          Add Task
        </button>
      </div>

      {/* Add Task Modal */}
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
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
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
