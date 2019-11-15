import { PluginFunctions } from 'draft-js-plugins-editor'
import { EditorState, Modifier, SelectionState } from 'draft-js'

import { getExpressionInOffset } from './utils/get-expression-in-offset'

/**
 * It when backspace is pressed right after an expression, it should be removed
 * altogether (like it's an atomic thing), and keyBindingFn handles that.
 * It could be handled with [onChange](https://github.com/draft-js-plugins/draft-js-plugins/blob/master/HOW_TO_CREATE_A_PLUGIN.md#onchange)
 * hook too.
 * @param getEditorState
 * @param setEditorState
 */
export const keyBindingFn = ({
  getEditorState,
  setEditorState
}: Pick<PluginFunctions, 'setEditorState' | 'getEditorState'>) => e => {
  const editorState = getEditorState()
  const selection = editorState.getSelection()

  if (e.key === 'Backspace' && selection.isCollapsed()) {
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getAnchorKey())

    const expression = getExpressionInOffset(block, selection.getAnchorOffset())

    if (expression) {
      const newEditorState = EditorState.push(
        editorState,
        Modifier.removeRange(
          editorState.getCurrentContent(),
          selection.merge({
            anchorOffset: expression.from,
            focusOffset: expression.to
          }) as SelectionState,
          'forward'
        ),
        'backspace-character'
      )

      setEditorState(newEditorState)

      return 'remove-expression' // just to prevent default behavior
    }
  }

  return undefined
}
