const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// ROUTES
const projectRoutes = require('./routes/projects')
const taskRoutes = require('./routes/tasks')

app.use('/projects', projectRoutes)
app.use('/tasks', taskRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API is running' })
})

const PORT = 4800
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`)
})
