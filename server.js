const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');

const middleware = require('./middleware')
const utils = require('./utils')

const PORT = process.env.PORT || 1337

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.send(utils.generateHtml())
})

const routes = require('./routes/upload')
app.use('/upload', routes)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
