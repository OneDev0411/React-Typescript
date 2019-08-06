import { ContentState, Modifier, SelectionState, EditorState } from 'draft-js'

export function insertTemplateVariable(
  editorState: EditorState,
  expression: string,
  fallback: string = ''
) {
  const newContent = insertTemplateVariableAtSelection(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    expression,
    fallback
  )

  return EditorState.forceSelection(
    EditorState.push(editorState, newContent, 'insert-characters'),
    newContent.getSelectionAfter()
  )
}
export function insertTemplateVariableAtSelection(
  contentState: ContentState,
  selection: SelectionState,
  expression: string,
  fallback: string = ''
) {
  return Modifier.replaceText(
    contentState,
    selection,
    createTemplateExpression(expression, fallback)
  )
}

function createTemplateExpression(
  expression: string,
  fallbackValue: string = ''
) {
  return `{{ ${expression} | fallback:"${escapeDoubleQuotes(fallbackValue)}" }}`
}

function escapeDoubleQuotes(input: string) {
  return input.replace('"', '\\"')
}
