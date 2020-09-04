export function loadJS(src, id, cb) {
  const ref = window.document.getElementsByTagName('script')[0]
  const script = window.document.createElement('script')

  script.src = src
  script.async = true
  script.id = id
  ref.parentNode.insertBefore(script, ref)

  if (cb && typeof cb === 'function') {
    script.onload = cb
  }

  if (id && typeof cb === 'string') {
    script.id = id
  }

  return script
}

export function unloadJS(id) {
  const element = window.document.getElementById(id)
  if (element) {
    element.remove()
  }
}
