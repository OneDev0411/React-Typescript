import process = require("process");

jest.setTimeout(60000)

global.host = process.env.E2E_HOST || 'http://0.0.0.0:8080'
global.email = process.env.E2E_EMAIL || 'emil+agent@rechat.com'
global.password = process.env.E2E_PASSWORD || 'aaaaaa'
