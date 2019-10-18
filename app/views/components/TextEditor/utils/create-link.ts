import { EditorState, Modifier, RichUtils, SelectionState } from 'draft-js'
import PluginsUtils from 'draft-js-plugins-utils'

import { getSelectionText, setBlockData } from 'draftjs-utils'

import { collapseSelection } from './collapse-selection'
import { getSelectedBlock } from './get-selected-block'

/**
 * Replaces the selection with the given text (or inserts the text into the
 * cursor position) and links it.
 * @param editorState
 * @param text
 * @param url
 * @param underline: whether to apply underline inline style to the link or not
 * @returns new editor state
 */
export function createLink(
  editorState: EditorState,
  url: string,
  text: string = getSelectionText(editorState),
  underline = true
): EditorState {
  const selectedBlock = getSelectedBlock(editorState)

  if (selectedBlock && selectedBlock.getType() === 'atomic') {
    /**
     * If an atomic block is selected (via selectable plugin), we add link
     * metadata into it's data instead of replacing it with a link
     */
    return setBlockData(editorState, {
      href: url,
      tooltip: text
    })
  }

  // If something is selected, replace it with the provided `text`
  const newContentState = Modifier.replaceText(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    text
  )

  // Get a hold of selectionAfter which will be the end of the new text
  const selectionAfter = newContentState.getSelectionAfter()

  // Select the whole new text
  const newTextSelection = selectionAfter.set(
    'anchorOffset',
    selectionAfter.getAnchorOffset() - text.length
  ) as SelectionState

  // Create the new editor state out of the new content and the new selection
  let newEditorState = EditorState.forceSelection(
    EditorState.set(editorState, {
      currentContent: newContentState
    }),
    newTextSelection
  )

  // Create a link using draft-js-plugins-utils helpers.
  // The new link will be selected in the returned editor state
  newEditorState = PluginsUtils.createLinkAtSelection(newEditorState, url)

  if (underline) {
    // Apply underline style if needed. Note that the link is already selected
    // and ready for getting the styles
    newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE')
  }

  newEditorState = EditorState.forceSelection(
    newEditorState,
    collapseSelection(newEditorState.getSelection())
  )

  // Turn off underline style
  newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE')

  return newEditorState
}
