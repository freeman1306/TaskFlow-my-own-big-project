'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProjectStore } from '@/store/project-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ProjectsPage() {
  const { projects, loading, error, fetchProjects, createProject } = useProjectStore()

  // UI state
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // Create Project
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const title = form.get('title') as string
    const description = form.get('description') as string

    await createProject({ title, description })
    setOpen(false)
  }

  return (
    <>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Projects</h1>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => setOpen(true)}
          >
            Add Project
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-2">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="block border p-4 rounded hover:bg-gray-50">
              <h3 className="text-lg font-medium">{p.title}</h3>
              <p className="text-gray-600">{p.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Add Project Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" type="text" placeholder="Project title" className="w-full border p-2 rounded" />

            <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" />

            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Create
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
