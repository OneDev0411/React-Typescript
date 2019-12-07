import * as React from 'react'
import { ContentBlock } from 'draft-js'

import { Iframe } from '../../Iframe'

interface Options {
  decorator?: any
}

export default function createIframePlugin({ decorator = i => i }: Options) {
  const component = decorator(IFrameBlock)

  return {
    blockRendererFn: (block: ContentBlock) => {
      const data = block.getData()

      if (block.getType() === 'atomic' && data.get('srcDoc')) {
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
 * some classname into iframe. the inner html content of the element will be
 * used as the srcDoc of the iframe
 * @param className
 */
export const iFrameCustomBlockFn = (className: string) => (
  element: HTMLElement
) => {
  if (element.classList.contains(className)) {
    const srcDoc = `${element.outerHTML}`

    // To prevent being removed in stateFromHtml
    element.innerHTML = '\u200B'

    return {
      type: 'atomic',
      data: {
        srcDoc
      }
    }
  }
}

export const renderIFrame = (block: ContentBlock) => {
  const data = block.getData()

  if (block.getType() === 'atomic' && data.get('srcDoc')) {
    return data.get('srcDoc')
  }

  return undefined
}

const IFrameBlock = ({ block }) => {
  const data = block.getData()

  return (
    <Iframe title="embeded-iframe" autoHeight srcDoc={data.get('srcDoc')} />
  )
}
