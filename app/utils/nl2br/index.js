export function nl2br(string, is_xhtml = false) {
  const breakTag =
    is_xhtml || typeof is_xhtml === 'undefined' ? '<br />' : '<br>'

  return `${string}`.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`)
}