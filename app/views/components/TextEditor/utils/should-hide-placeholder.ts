export function shouldHidePlaceholder(editorState) {
  const contentState = editorState.getCurrentContent()

  if (contentState.hasText()) {
    return false
  }

  if (contentState.getBlockMap().first().getType() !== 'unstyled') {
    return true
  }
}
