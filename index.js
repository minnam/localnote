#!/usr/bin/env node
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const args = require('minimist')(process.argv.slice(2));


const DEFAULT_ARGS = {
  p: 8888,
  port: 8888,
  buffer: 1e8, // 100mb
  ...args
}

const io = require('socket.io')(server, {
  maxHttpBufferSize: 1e8
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
  const address = socket.handshake.address;

  socket.on('msg', (msg) => {
    io.emit('msg', { ip: address, content: msg, time: new Date().toLocaleString() });
  })
})

server.listen(DEFAULT_ARGS.p, () => {
  console.log(`localnote running on *:${DEFAULT_ARGS.p}`)
})