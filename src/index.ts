const env = require('dotenv').config()
const express = require('express')
const ApiRoutes = require('./routes/app.ts')
const compression = require("compression")

const port = Number(process.env.PORT || 3001)
const app = express()

app.use(express.json())
app.use('/', ApiRoutes)

app.listen(port, () =>
    console.log(`Listening on http://localhost:${port}`)
);
