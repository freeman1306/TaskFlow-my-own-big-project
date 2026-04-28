import { TaskCard } from './TaskCard'

export function Column({ status, tasks, onDropTask }) {
  const handleDrop = (e) => {
    const taskId = Number(e.dataTransfer.getData('taskId'))
    onDropTask(taskId, status)
  }

  return (
    <div className="border rounded p-4 min-h-[400px]" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <h2 className="text-xl font-semibold mb-4">{status.replace('_', ' ').toUpperCase()}</h2>

      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} />
      ))}
    </div>
  )
}
