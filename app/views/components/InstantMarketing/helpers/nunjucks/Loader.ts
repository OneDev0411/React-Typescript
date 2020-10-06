import nunjucks from 'nunjucks'

import { MJML_PALETTE, HTML_PALETTE } from './templates'

const templates = {
  'palette.mjml': MJML_PALETTE,
  'palette.html': HTML_PALETTE
}

const Loader = nunjucks.Loader.extend({
  getSource: name => {
    if (!templates[name]) {
      throw new Error(`Template ${name} not found`)
    }

    return {
      src: templates[name],
      path: name
    }
  }
})

export default Loader
