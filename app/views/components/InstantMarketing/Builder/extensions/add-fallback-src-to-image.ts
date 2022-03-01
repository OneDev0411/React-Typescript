import type { Editor } from 'grapesjs'

import { handleImageFallbackSrc } from './add-fallback-src-to-mj-image'

export function addFallbackSrcToImage(editor: Editor) {
  editor.DomComponents.addType('image', {
    view: {
      onRender({ model, el }) {
        handleImageFallbackSrc(el, model)
      }
    }
  })
}
