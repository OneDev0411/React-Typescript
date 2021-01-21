import { Editor } from 'grapesjs'

import { baseView, isComponent } from '../utils'

export const typeRow = 'ws-row'
export const typeColumn = 'ws-column'

export default (
  editor: Editor,
  rowBlockClassNames: string = '',
  columnBlockClassNames: string = ''
) => {
  editor.DomComponents.addType(typeRow, {
    isComponent: isComponent(typeRow),
    model: {
      defaults: {
        name: 'Row',
        attributes: { class: typeRow },
        traits: ['href']
      }
    },
    view: { ...baseView(rowBlockClassNames) }
  })

  editor.DomComponents.addType(typeColumn, {
    isComponent: isComponent(typeColumn),
    model: {
      defaults: {
        name: 'Column',
        draggable: `[data-gjs-type="${typeRow}"]`,
        attributes: { class: typeColumn }
      }
    },
    view: { ...baseView(columnBlockClassNames) }
  })
}
