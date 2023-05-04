const express = require('express')
const app = express()
const PORT = 8000 // might add .env variable later

app.use(express.static('public'))

app.listen(PORT, _ => console.log(`Server listening on port ${PORT}`))