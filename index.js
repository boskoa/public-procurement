const { PORT } = require('./utils/config')
const express = require('express')
const { connectToDatabase } = require('./utils/db')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const proceduresRouter = require('./controllers/procedures')
const contractingAuthoritiesRouter = require('./controllers/contractingAuthorities')
const requirementsRouter = require('./controllers/requirements')
const notificationsRouter = require('./controllers/notifications')
const avatarsRouter = require('./controllers/avatars')
const analysisRouter = require('./controllers/analysis')
const { errorHandler } = require('./utils/errorHandler')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.static('build'))

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/procedures', proceduresRouter)
app.use('/api/authorities', contractingAuthoritiesRouter)
app.use('/api/requirements', requirementsRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/avatar', avatarsRouter)
app.use('/api/analysis', analysisRouter)
app.all('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(process.env.PORT || 3003, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
