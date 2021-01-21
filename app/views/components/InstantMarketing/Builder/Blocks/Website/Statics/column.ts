import { Editor } from 'grapesjs'

import { baseView, isComponent } from '../utils'
import { typeRow } from './row'

export const typeColumn = 'ws-column'

export default (editor: Editor, blockClassNames: string = '') => {
  editor.DomComponents.addType(typeColumn, {
    isComponent: isComponent(typeColumn),
    model: {
      defaults: {
        name: 'Column',
        draggable: `[data-gjs-type="${typeRow}"]`,
        attributes: { class: typeColumn }
      }
    },
    view: { ...baseView(blockClassNames) }
  })
}
