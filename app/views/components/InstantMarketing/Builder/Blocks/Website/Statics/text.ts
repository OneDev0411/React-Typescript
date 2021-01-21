import { Editor } from 'grapesjs'

import { baseView, isComponent } from '../utils'

export const typeText = 'ws-text'

export default (editor: Editor, blockClassNames: string = '') => {
  editor.DomComponents.addType(typeText, {
    isComponent: isComponent(typeText),
    extend: 'text',
    extendView: 'text',
    model: {
      defaults: {
        name: 'Text',
        attributes: { class: typeText }
      }
    },
    view: { ...baseView(blockClassNames) }
  })
}
