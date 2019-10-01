import { ContentBlock, ContentState, EditorState, Modifier } from 'draft-js'

/**
 * Appends blocks to the content without affecting selection state
 */
export function appendBlocks(
  editorState: EditorState,
  blocks: ContentBlock[]
): EditorState {
  const selection = EditorState.moveSelectionToEnd(editorState).getSelection()
  const lastBlock = editorState.getCurrentContent().getLastBlock()

  const newContent = Modifier.replaceWithFragment(
    editorState.getCurrentContent(),
    selection,
    ContentState.createFromBlockArray([
      ...(lastBlock.getType() === 'atomic' ? [lastBlock] : []),
      ...blocks
    ]).getBlockMap()
  )

  // It would be better to call `EditorState.set()` instead of
  // `EditorState.push` to prevent undo stack pollution, but it
  // causes an error when appendBlock is called for the first time.
  // The error is similar to this:
  // https://github.com/facebook/draft-js/issues/1820
  return EditorState.push(
    editorState,
    newContent
      .set('selectionAfter', selection)
      .set('selectionBefore', selection) as ContentState,
    'insert-fragment'
  )
}
