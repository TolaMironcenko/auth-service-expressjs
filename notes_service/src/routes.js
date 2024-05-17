const host = "http://127.0.0.1:8000"
const prefix = "api"

export default {
    access: () => [host, prefix, 'access', ''].join('/'),
}