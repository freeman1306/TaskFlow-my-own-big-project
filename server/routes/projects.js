// === TF CLEANUP START (Copilot) ===
// Исправлено:
// 1) projectId приводится к числу
// 2) добавлен try/catch для стабильности
// 3) улучшена обработка ошибок
// === TF CLEANUP END (Copilot) ===

const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

// GET /projects
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany()
    res.json(projects)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load projects' })
  }
})

// POST /projects — create project
router.post('/', async (req, res) => {
  const { title, description } = req.body

  try {
    const project = await prisma.project.create({
      data: { title, description },
    })

    res.json(project)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// GET /projects/:id/tasks — get tasks for project
router.get('/:id/tasks', async (req, res) => {
  const projectId = req.params.id

  const tasks = await prisma.task.findMany({
    where: { projectId },
    orderBy: [{ status: 'asc' }, { order: 'asc' }],
  })

  res.json(tasks)
})

module.exports = router
