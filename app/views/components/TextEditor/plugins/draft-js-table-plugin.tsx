import { ContentBlock } from 'draft-js'

import { Iframe } from '../../Iframe'

export default function createTablePlugin() {
  const component = tableBlock

  return {
    blockRendererFn: (block: ContentBlock) => {
      const data = block.getData()

      if (block.getType() === 'atomic' && data.get('outerHTML')) {
        return {
          component,
          editable: false
        }
      }

      return null
    }
  }
}

/**
 * A function to be used in stateFromHTML options to convert elements with
 * some class name and a child table element into table. the inner html content of the element will be
 * used as the srcDoc of the iframe
 * @param className
 */
export const tableCustomBlockFn =
  (className: string) => (element: HTMLElement) => {
    if (
      element.classList.contains(className) &&
      element.children[0]?.tagName.toLowerCase() === 'table'
    ) {
      const outerHTML = `${element.outerHTML}`

      // To prevent being removed in stateFromHtml
      element.innerHTML = '\u200B'

      return {
        type: 'atomic',
        data: {
          outerHTML
        }
      }
    }
  }

export const renderTable = (block: ContentBlock) => {
  const data = block.getData()

  if (block.getType() === 'atomic' && data.get('outerHTML')) {
    return data.get('outerHTML')
  }

  return undefined
}

const tableBlock = ({ block }) => {
  const data = block.getData()

  return (
    <Iframe title="embedded-table" autoHeight srcDoc={data.get('outerHTML')} />
  )
}
