import express from 'express'
import dotenv from 'dotenv'
import {auth} from './auth.js'
import {
    get_all_users, 
    get_user, 
    add_user, 
    change_password, 
    del_user, 
    del_user_as_superuser, 
    user_access
} from './users.js'

const app = express()
dotenv.config()
const port = process.env.PORT || 5000

app.use(express.json())

// ------------ authorization -------------
app.get('/api/allusers', get_all_users)
app.get('/api/user', get_user)
app.post('/api/token', auth)
app.post('/api/adduser', add_user)
app.post('/api/changepassword', change_password)
app.post('/api/deluser', del_user)
app.post('/api/deluserassupeuser', del_user_as_superuser)
app.post('/api/access', user_access)
// ----------------------------------------

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

