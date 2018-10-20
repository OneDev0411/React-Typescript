export function loadJS(src, cb) {
  const ref = window.document.getElementsByTagName('script')[0]
  const script = window.document.createElement('script')

  script.src = src
  script.async = true
  ref.parentNode.insertBefore(script, ref)

  if (cb && typeof cb === 'function') {
    script.onload = cb
  }

  return script
}
