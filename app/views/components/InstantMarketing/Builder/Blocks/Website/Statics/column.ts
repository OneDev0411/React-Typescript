import { Editor } from 'grapesjs'

import { isComponent } from '../utils'

export const typeRow = 'ws-row'
export const typeColumn = 'ws-column'

const column = (editor: Editor) => {
  editor.DomComponents.addType(typeRow, {
    isComponent: isComponent(typeRow),
    model: {
      defaults: {
        name: 'Row',
        attributes: { className: typeRow }
      }
    },
    view: { tagName: 'div' }
  })

  editor.DomComponents.addType(typeColumn, {
    isComponent: isComponent(typeColumn),
    model: {
      defaults: {
        name: 'Column',
        draggable: `[data-gjs-type="${typeRow}"]`,
        attributes: { className: typeColumn }
      }
    },
    view: { tagName: 'div' }
  })
}

export default column
