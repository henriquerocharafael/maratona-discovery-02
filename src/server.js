const express = require('express')
const server = express()
const routes = require('./routes')
const path = require('path')

const PORT = 3000

// ejs template engine
server.set('view engine', 'ejs')

// Mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

// habilita arquivos static
server.use(express.static('public'))

// usar o req.body
server.use(express.urlencoded({ extended: true }))

// routes
server.use(routes)

server.listen(PORT, () => console.log(`server is running on port ${PORT}`))