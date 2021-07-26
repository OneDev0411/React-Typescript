import { ContentBlock, EditorState } from 'draft-js'

import { blockStyleFn } from './block-style-fn'
import { renderAtomicBlockAttrs } from './render-atomic-block-attributes'
import { renderAtomicBlockStyles } from './render-atomic-block-styles'
import { renderAttributes } from './render-attributes'
import { stylesToString } from './styles-to-string'

export const renderImage =
  (getEditorState: () => EditorState | null) => (block: ContentBlock) => {
    const entityKey = block.getEntityAt(0)

    const editorState = getEditorState()

    if (entityKey && editorState) {
      const entity = editorState.getCurrentContent().getEntity(entityKey)

      if (entity.getType().toLocaleLowerCase() === 'image') {
        const data = entity.getData()
        const atomicStyles = renderAtomicBlockStyles(data)
        const imgAttrsStr = renderAtomicBlockAttrs(data)

        const img = `<img style="${atomicStyles}" ${imgAttrsStr} />`

        const { attributes = {}, style = {} } = blockStyleFn(block) || {}

        const styleString = stylesToString({ margin: 0, ...style })

        const attrsString = renderAttributes(attributes)

        return `<figure style="${styleString}" ${attrsString}>${img}</figure>`
      }
    }

    return undefined
  }
