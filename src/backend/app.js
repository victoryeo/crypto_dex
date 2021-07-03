const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors') 

const index   = require('./routes/index')

const app = express()
const port = 8091

app.use(cors())

app.use(bodyParser.text() )
app.use(bodyParser.json() )
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', index)

app.listen(port, () => {
  console.log(`DEX app listening on port ${port}!`)
})

module.export = app
