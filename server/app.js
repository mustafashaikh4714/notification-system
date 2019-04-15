require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
const cors = require('cors')
app.use(express.urlencoded({ extended: true }))

require('./routes/main')(app)

// database connection
require('./config/database')

app.listen(process.env.PORT, () => {
  console.log('Server is up on port 4000')
})

module.exports = { app }
