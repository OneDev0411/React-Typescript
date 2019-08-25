import { ContentState, EditorState } from 'draft-js'

export function removeUnwantedEmptyLineBeforeAtomic(editorState: EditorState) {
  const content = editorState.getCurrentContent()
  const blocks = content.getBlocksAsArray()

  if (
    blocks.length > 1 &&
    blocks[0].getType() === 'unstyled' &&
    !blocks[0].getText() &&
    blocks[0].getCharacterList().size === 0 &&
    blocks[1].getType() === 'atomic'
  ) {
    const newContent = content.merge({
      blockMap: content.getBlockMap().remove(blocks[0].getKey())
    }) as ContentState

    return EditorState.set(editorState, { currentContent: newContent })
  }

  return editorState
}
