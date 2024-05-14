import jwt from 'jsonwebtoken'
import fs from 'fs'

const auth = (request, response) => {
    const username = request.body.username
    const password = request.body.password

    const all_users = JSON.parse(fs.readFileSync(process.env.USERS_FILE, 'utf-8'))

    const user = all_users.find((user) => {
        if (user.username === username && user.password === password) {
            return user
        }
        return false
    })

    if (user) {
        const jwt_secret_key = process.env.JWT_SECRET_KEY
        // const userid = 
        const data = {
            time: Date(),
            userId: user.id
        }
        const token = jwt.sign(data, jwt_secret_key)
        response.json({"token": `${token}`})
    } else {
        response.json({"status": "403"})
    }
}

const verify_auth = (token) => {
    const jwt_secret_key = process.env.JWT_SECRET_KEY
    try {
        const verified = jwt.verify(token, jwt_secret_key)
        if (verified) {
            return true
        }
    } catch (err) {
        return false
    }
}

export {auth, verify_auth}

