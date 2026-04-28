export function TaskCard({ task }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id)
  }

  return (
    <div className="border p-3 rounded mb-3 bg-white cursor-grab" draggable onDragStart={handleDragStart}>
      <h3 className="font-medium">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.priority}</p>
    </div>
  )
}
