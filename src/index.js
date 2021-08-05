const path = require('path')
const http = require('http')
const express = require('express')
const socketio =require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('new connection!!')

  socket.emit('message', "welcome!")
  socket.broadcast.emit('message', 'a new user has joined!')

  socket.on("sendMessage", (message) => {
    io.emit("message", message)
  })

  socket.on('disconnect', () => {
    io.emit("message", "user has left!")
  })
})

server.listen(port, () => {
  console.log(`listening on port ${port}`)
})
