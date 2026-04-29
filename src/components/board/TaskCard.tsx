import { Task } from '@/store/task-store'

interface TaskCardProps {
  task: Task
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-white p-3 rounded border border-gray-200 cursor-move hover:shadow-md transition-shadow mb-2"
    >
      <h3 className="font-medium text-sm">{task.title}</h3>
      {task.description && <p className="text-xs text-gray-500 mt-1">{task.description}</p>}
      <div className="flex gap-2 mt-2 text-xs">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{task.status}</span>
        {task.priority && <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">{task.priority}</span>}
      </div>
    </div>
  )
}
