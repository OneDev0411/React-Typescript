import { MJML_PALETTE, HTML_PALETTE } from './templates'

const templates = {
  'palette.mjml': MJML_PALETTE,
  'palette.html': HTML_PALETTE
}

function Loader() {}

Loader.prototype.getSource = function getSource(name: string) {
  if (!templates[name]) {
    throw new Error(`Template ${name} not found`)
  }

  return {
    src: templates[name],
    path: name
  }
}

export default Loader
