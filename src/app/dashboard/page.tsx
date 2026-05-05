'use client'

import { useTaskStore } from '@/store/task-store'

export default function BoardPage() {
  const tasks = useTaskStore((s) => s.tasks)

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Task Board</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col.id} className="p-4 border rounded-lg bg-card min-h-100">
            <h2 className="text-lg font-semibold mb-4">{col.title}</h2>

            {tasks
              .filter((t) => t.status === col.id)
              .map((task) => (
                <div key={task.id} className="p-3 mb-3 rounded border bg-background shadow-sm">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
