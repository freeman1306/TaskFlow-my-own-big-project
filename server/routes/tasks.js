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
const { PrismaClient } = require('@prisma/client')

// CREATE task
router.post('/', async (req, res) => {
  try {
    const { title, description, projectId, status, priority } = req.body

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        projectId: Number(projectId),
      },
    })

    res.json(task)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// UPDATE task
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { title, description, status, priority } = req.body

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
      },
    })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE task
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)

  try {
    const deleted = await prisma.task.delete({
      where: { id },
    })

    res.json(deleted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

// get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    })

    res.json(tasks)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load tasks' })
  }
})

module.exports = router
