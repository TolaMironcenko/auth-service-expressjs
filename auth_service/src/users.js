import {verify_auth} from './auth.js'
import {jwtDecode} from 'jwt-decode'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';

const get_all_users = (request, response) => {
	const token = request.body.token
	if (!token) {response.json({"status":"403"});return}
	if (verify_auth(token)) {
		const all_users = JSON.parse(fs.readFileSync(process.env.USERS_FILE, 'utf-8'))
		const user = all_users.find(usr => {
			if (usr.id === jwtDecode(token).userId) {
				return usr
			}
			return false
		})
		if (user && user.is_superuser) {
			response.json(all_users)
		} else response.json({"status":"403"})
	} else response.json({"status":"403"})
}

const get_user = (request, response) => {
	const token = request.body.token
	if (!token) {response.json({"status":"403"});return}
	if (!verify_auth(token)) response.json({"status":"403"})
	const all_users = JSON.parse(fs.readFileSync(process.env.USERS_FILE, 'utf-8'))
	const user = all_users.find(usr => {
		if (usr.id === jwtDecode(token).userId) {
			return usr
		}
		return false
	})
	if (!user) {response.json({"status": "403"})} else {delete user["password"];response.json(user)}
}

const add_user = (request, response) => {
	const token = request.body.token
	if (!token) {response.json({"status":"403"});return}
	if (!verify_auth(token)) response.json({"status":"403"})
	const all_users = JSON.parse(fs.readFileSync(process.env.USERS_FILE, 'utf-8'))

	const user = all_users.find(usr => {
		if (usr.id === jwtDecode(token).userId) {
			return usr
		}
		return false
	})
	if (user && user.is_superuser) {
		if (!request.body.username) {response.json({"required": "[username, password, group, is_superuser]"});return}
		if (!request.body.password) {response.json({"required": "[username, password, group, is_superuser]"});return}
		if (!request.body.group) {response.json({"required": "[username, password, group, is_superuser]"});return}
		const username = request.body.username
		const password = request.body.password
		const group = request.body.group
		const is_superuser = request.body.is_superuser || 0
		const new_user = {
			"id": uuidv4(), 
			"username": username, 
			"password": password, 
			"group": group,
			"is_superuser": is_superuser
		}
		console.log(uuidv4())
		all_users.push(new_user)
		fs.writeFileSync(process.env.USERS_FILE, JSON.stringify(all_users))
		response.json({"status": "ok", "new_user": new_user})
	} else response.json({"status": "403"})
}

const change_password = (request, response) => {
	const token = request.body.token
	if (!token) {response.json({"status":"403"});return}
	if (!verify_auth(token)) {response.json({"status":"403"});return}
	const all_users = JSON.parse(fs.readFileSync(process.env.USERS_FILE, 'utf-8'))
	if (!request.body.old_password) {response.json({"required": "[old_password, new_password]"});return}
	if (!request.body.new_password) {response.json({"required": "[old_password, new_password]"});return}
	const old_password = request.body.old_password
	const new_password = request.body.new_password

	let status = false
	all_users.forEach((usr, index) => {
		if (usr.id === jwtDecode(token).userId && usr.password === old_password) {
			usr.password = new_password
			fs.writeFileSync(process.env.USERS_FILE, JSON.stringify(all_users))
			response.json({"status": "ok"})
			status = true
			return true
		}
	})
	if (!status) response.json({"status":"403"})
}

const del_user = (request, response) => {
	const token = request.body.token
	if (!token) {response.json({"status":"403"});return}
	if (!verify_auth(token)) {response.json({"status":"403"});return}
	const all_users = JSON.parse(fs.readFileSync(process.env.USERS_FILE, 'utf-8'))
	const deluserdata = all_users.find(usr => {
		if (usr.id === jwtDecode(token).userId) {
			return usr
		}
	})
	if (!deluserdata) {response.json({"status":"403"});return}
	const new_all_users = all_users.filter(usr => {
		if (usr.id !== jwtDecode(token).userId) {
			return usr
		}
	})
	fs.writeFileSync(process.env.USERS_FILE, JSON.stringify(new_all_users))
	response.json({"status": "ok"})
}

const del_user_as_superuser = (request, response) => {
	const token = request.body.token
	if (!token) {response.json({"status":"403"});return}
	if (!verify_auth(token)) {response.json({"status":"403"});return}
	if (!request.body.deluserid) {response.json({"needed":"[token, deluserid]"});return}
	const deluserid = request.body.deluserid
	const all_users = JSON.parse(fs.readFileSync(process.env.USERS_FILE, 'utf-8'))
	const user = all_users.find(usr => {
		if (usr.id === jwtDecode(token).userId) {
			return usr
		}
		return false
	})
	if (user && user.is_superuser) {
		const deluserdata = all_users.find(usr => {
			if (usr.id === deluserid) {
				return usr
			}
		})
		if (!deluserdata) {response.json({"status":"nouser"});return}
		const new_all_users = all_users.filter(usr => {
			if (usr.id !== deluserid) {
				return usr
			}
		})
		fs.writeFileSync(process.env.USERS_FILE, JSON.stringify(new_all_users))
		response.json({"status": "ok"})
	} else response.json({"status": "403"})
}

const user_access = (request, response) => {
	const token = request.body.token
	if (!token) {response.json({"access":"reject"});return}
	if (!verify_auth(token)) {response.json({"access":"reject"});return}
	response.json({"access": "success"})
}

export {get_all_users, get_user, add_user, change_password, del_user, del_user_as_superuser, user_access}
