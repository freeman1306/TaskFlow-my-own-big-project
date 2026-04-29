const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')

// create task
router.post('/', async (req, res) => {
  const task = await prisma.task.create({
    data: req.body,
  })
  res.json(task)
})

//update task
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const updated = await prisma.task.update({
    where: { id },
    data: req.body,
  })

  res.json(updated)
})

// DELETE task
router.delete('/:id', async (req, res) => {
  const id = req.params.id

  const deleted = await prisma.task.delete({
    where: { id },
  })

  res.json(deleted)
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
