export default function(response) {
  if (response.body === null && response.text) {
    try {
      response.body = JSON.parse(response.text)
    } catch (e) {
      response.body = {}
    }
  }
}
