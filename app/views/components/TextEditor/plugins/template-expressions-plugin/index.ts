import { DraftJsPlugin, PluginFunctions } from 'draft-js-plugins-editor'

import { EditorState } from 'draft-js'

import { templateExpressionStrategy } from './template-expression-strategy'
import { TemplateExpression } from './TemplateExpression'
import { keyBindingFn } from './key-binding-fn'
import { insertTextOutsideExpressions } from './insert-text-outside-expressions'

export default function createTemplateExpressionsPlugin(): DraftJsPlugin {
  const store: { fns?: PluginFunctions } = {}

  return {
    initialize: fns => (store.fns = fns),
    decorators: [
      { strategy: templateExpressionStrategy, component: TemplateExpression }
    ],
    /**
     * `contentEditable=false` in expression's component prevents typing within
     * the expression but for some reason if the cursor is right after the
     * expression and the expression is the last thing in that block, the inputted
     * character gets it's way into the expression and breaks it.
     * This function prevents this by detecting such inputs and preventing normal
     * Draft behavior in this case and manually adding the inserted text after the
     * expression.
     */
    handleBeforeInput: (
      chars: string,
      editorState: EditorState,
      { setEditorState }
    ) => {
      return insertTextOutsideExpressions(editorState, setEditorState, chars)
    },
    handleReturn: (e, editorState, { setEditorState }) => {
      return insertTextOutsideExpressions(editorState, setEditorState, '\n')
    },
    keyBindingFn: keyBindingFn({
      getEditorState: () => store.fns!.getEditorState(),
      setEditorState: editorState => store.fns!.setEditorState(editorState)
    })
  }
}
