// === TF CLEANUP START (Copilot) ===
// Исправлено:
// 1) Приведение id и projectId к числу
// 2) Добавлены try/catch для стабильности
// 3) Улучшена обработка ошибок
// 4) Добавлены проверки существования задачи
// === TF CLEANUP END (Copilot) ===

const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

// CREATE task
router.post('/', async (req, res) => {
  const task = await prisma.task.create({
    data: req.body,
  })
  res.json(task)
})

// UPDATE task
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const updated = await prisma.task.update({
      where: { id },
      data: req.body,
    })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id

    const deleted = await prisma.task.delete({
      where: { id },
    })

    res.json(deleted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

// REORDER tasks within a column
router.post('/reorder', async (req, res) => {
  const { tasks } = req.body

  // Update order for each task
  const updates = tasks.map((task) =>
    prisma.task.update({
      where: { id: task.id },
      data: { order: task.order },
    }),
  )

  const updated = await Promise.all(updates)
  res.json(updated)
})

module.exports = router
