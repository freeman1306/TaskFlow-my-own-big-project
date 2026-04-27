const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

// GET /projects
router.get('/', async (req, res) => {
  const projects = await prisma.project.findMany()

  res.json(projects)
})

//create project
router.post('/', async (req, res) => {
  const { name } = req.body

  const project = await prisma.project.create({
    data: { name },
  })

  res.json(project)
})

//GET /projects/:id/tasks
router.get('/:id/tasks', async (req, res) => {
  const projectId = req.params.id

  const tasks = await prisma.task.findMany({
    where: { projectId },
  })

  res.json(tasks)
})

module.exports = router
