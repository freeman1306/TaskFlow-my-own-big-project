import { Task } from '@/store/task-store'
import { TaskCard } from './TaskCard'

interface ColumnProps {
  status: string
  tasks: Task[]
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: string) => void
}

export function Column({ status, tasks, onDragStart, onDragOver, onDrop }: ColumnProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      className="bg-gray-50 rounded-lg p-4 min-h-[600px] flex-1"
    >
      <h2 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wide">
        {status.replace('-', ' ')} ({tasks.length})
      </h2>

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
      </div>

      {tasks.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No tasks</p>}
    </div>
  )
}
