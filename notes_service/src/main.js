import express from 'express'
import dotenv from 'dotenv'
import { get_all_notes, set_all_notes } from './notes.js'

const app = express()

app.use(express.json())
dotenv.config()
const port = process.env.PORT || 5000

app.use(express.json())

app.get('/api/allnotes', get_all_notes)
app.post('/api/setallnotes', set_all_notes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
