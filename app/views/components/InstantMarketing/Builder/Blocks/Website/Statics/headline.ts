import { Editor } from 'grapesjs'

import { baseView, isComponent } from '../utils'

export const typeHeadline1 = 'ws-h1'
export const typeHeadline2 = 'ws-h2'

interface HeadlineOptions {
  h1BlockClassNames?: string
  h2BlockClassNames?: string
}

export default (
  editor: Editor,
  { h1BlockClassNames = '', h2BlockClassNames = '' }: HeadlineOptions
) => {
  editor.DomComponents.addType(typeHeadline1, {
    isComponent: isComponent(typeHeadline1),
    model: {
      defaults: {
        name: 'Headline 1',
        attributes: { class: typeHeadline1 }
      }
    },
    view: { ...baseView(h1BlockClassNames, 'h1') }
  })

  editor.DomComponents.addType(typeHeadline2, {
    isComponent: isComponent(typeHeadline2),
    model: {
      defaults: {
        name: 'Headline 2',
        attributes: { class: typeHeadline2 }
      }
    },
    view: { ...baseView(h2BlockClassNames, 'h2') }
  })
}
