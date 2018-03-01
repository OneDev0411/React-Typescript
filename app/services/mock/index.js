import nock from 'nock'
import config from '../../../config/public'

function getEndpointKey(url) {
  return url
    .split(/[?#]/)[0] // remove query string
    .replace('/', '') // change first slash to null
    .replace(/(?!^)\//g, '-') // change the rest slashes to dash
}

export default function mock({ endpoint, method, statusCode, response }) {
  const endpointKey = getEndpointKey(endpoint)

  return nock(`${config.app.url}/api/proxifier`)
    [method || 'post'](`/${endpointKey}`)
    .reply(statusCode || 200, response)
}
