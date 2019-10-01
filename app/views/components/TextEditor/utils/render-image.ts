import { ContentBlock, EditorState } from 'draft-js'

import { renderAtomicBlockStyles } from './render-atomic-block'
import { blockStyleFn } from './block-style-fn'
import { stylesToString } from './styles-to-string'

const renderAttributes = (attrs: StringMap<string>) =>
  Object.entries(attrs)
    .map(([name, value]) => renderAttribute(name, value))
    .join(' ')
const renderAttribute = (name: string, value: string) => `${name}="${value}"`
export const renderImage = (getEditorState: () => EditorState | null) => (
  block: ContentBlock
) => {
  const entityKey = block.getEntityAt(0)

  const editorState = getEditorState()

  if (entityKey && editorState) {
    const entity = editorState.getCurrentContent().getEntity(entityKey)

    if (entity.getType().toLocaleLowerCase() === 'image') {
      const data = entity.getData()
      const atomicStyles = renderAtomicBlockStyles(data)

      const img = `<img src="${data.src}" style="${atomicStyles}" />`

      const { attributes = {}, style = {} } = blockStyleFn(block) || {}

      const styleString = stylesToString({ margin: 0, ...style })

      const attrsString = renderAttributes(attributes)

      return `<figure style="${styleString}" ${attrsString}>${img}</figure>`
    }
  }

  return undefined
}
