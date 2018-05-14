export default function middleware(response, options) {
  if (!options.stream || !response.text) {
    return response
  }

  const { status } = response

  if (status >= 200 && status <= 206) {
    return decodeSuccessResponse(response)
  }

  return status
}

function decodeSuccessResponse(response) {
  try {
    response.body = JSON.parse(response.text)
    response.text = null
  } catch (e) {
    /* nothing */
  }

  return response
}
