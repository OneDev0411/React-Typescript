import React from 'react'
import ReactDom from 'react-dom'

import Toolbar from './Toolbar'

const factory = editor => {
  const $toolbar = editor.RichTextEditor.getToolbarEl()

  $toolbar.innerHTML = ''

  const enable = el => {
    el.contentEditable = true

    ReactDom.render(<Toolbar />, $toolbar)
  }

  const disable = el => {
    el.contentEditable = false
    ReactDom.unmountComponentAtNode(el)
  }

  return {
    enable,
    disable
  }
}

export default factory
