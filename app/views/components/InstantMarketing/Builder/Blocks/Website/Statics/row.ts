import { Editor } from 'grapesjs'

import { baseView, isComponent } from '../utils'

export const typeRow = 'ws-row'

export default (editor: Editor, blockClassNames: string = '') => {
  editor.DomComponents.addType(typeRow, {
    isComponent: isComponent(typeRow),
    model: {
      defaults: {
        name: 'Row',
        attributes: { class: typeRow }
      }
    },
    view: { ...baseView(blockClassNames) }
  })
}
