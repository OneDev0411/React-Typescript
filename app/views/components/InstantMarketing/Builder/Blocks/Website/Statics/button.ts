import { Editor } from 'grapesjs'

import { isComponent } from '../utils'

export const typeButton = 'ws-button'

export default (editor: Editor) => {
  editor.DomComponents.addType(typeButton, {
    isComponent: isComponent(typeButton),
    extend: 'link',
    extendView: 'link',
    model: {
      defaults: {
        name: 'Button',
        attributes: {
          className: typeButton,
          href: ''
        },
        traits: ['href']
      }
    },
    view: { tagName: 'a' }
  })
}
