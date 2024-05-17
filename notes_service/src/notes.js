import fs from 'fs'
import routes from './routes.js';

const get_all_notes = async (request, response) => {
    const token = request.body.token
	if (!token) {response.json({"status":"403"});return}
    console.log(routes.access())
    const access = await fetch(routes.access(), {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({"token": token})
    }).then(data => data.json())
    if (access.access !== "success") {response.json({"status":"403"});return}
    const all_notes = fs.readFileSync(process.env.NOTES_FILE, 'utf-8')
    response.json({"notes": JSON.stringify(all_notes)})
}

const set_all_notes = async (request, response) => {
    const token = request.body.token
	if (!token) {response.json({"status":"403"});return}
    if (!request.body.notes) {response.json({"required": "[notes]"});return}
    const all_notes = request.body.notes
    const access = await fetch(routes.access(), {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({"token": token})
    }).then(data => data.json())
    if (access.access !== "success") {response.json({"status":"403"});return}
    fs.writeFileSync(process.env.NOTES_FILE, all_notes)
    response.json({"status": "ok"})
}

export {get_all_notes, set_all_notes}
