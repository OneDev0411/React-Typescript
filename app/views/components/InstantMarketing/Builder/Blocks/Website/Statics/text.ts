import { Editor } from 'grapesjs'

import { isComponent } from '../utils'

export const typeText = 'ws-text'

const text = (editor: Editor) => {
  editor.DomComponents.addType(typeText, {
    isComponent: isComponent(typeText),
    extend: 'text',
    extendView: 'text',
    model: {
      defaults: {
        name: 'Text',
        attributes: { className: typeText }
      }
    },
    view: { tagName: 'div' }
  })
}

export default text
