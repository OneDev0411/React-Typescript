import { Editor } from 'grapesjs'

import { baseView, isComponent } from '../utils'

export const typeButton = 'ws-button'

export default (editor: Editor, blockClassNames: string = '') => {
  editor.DomComponents.addType(typeButton, {
    isComponent: isComponent(typeButton),
    extend: 'link',
    extendView: 'link',
    model: {
      defaults: {
        name: 'Button',
        attributes: {
          class: typeButton,
          href: ''
        }
      }
    },
    view: { ...baseView(blockClassNames, 'a') }
  })
}
