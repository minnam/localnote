#!/usr/bin/env node
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const args = require('minimist')(process.argv.slice(2));
var os = require('os');

const DEFAULT_ARGS = {
  p: 8888,
  port: 8888,
  b: 1e8, // 100mb
  buffer: 1e8, // 100mb
  ...args
}

const io = require('socket.io')(server, {
  maxHttpBufferSize: DEFAULT_ARGS.b
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
  const address = socket.handshake.address;

  console.log(`[${new Date().toLocaleString()}] ${address} has connected.`)

  socket.on('msg', (msg) => {
    io.emit('msg', { ip: address, content: msg, time: new Date().toLocaleString() });
  })
})

server.listen(DEFAULT_ARGS.p, () => {
  const networkInterfaces = os.networkInterfaces();

  console.log('')
  console.log(`✌ localnote running at:`)
  console.log('')
  for (const key in networkInterfaces) {
    networkInterfaces[key].map(a => {
      if (a.address.match(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
        console.log(`   http://${a.address}:${DEFAULT_ARGS.p}`)
      }
    })
  }
  console.log('')
  console.log('――――――――――――――――――――――――――――')
  console.log('')
})