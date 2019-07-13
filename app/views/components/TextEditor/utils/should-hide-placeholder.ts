export function shouldHidePlaceholder(editorState) {
  const contentState = editorState.getCurrentContent()

  if (!contentState.hasText()) {
    if (
      contentState
        .getBlockMap()
        .first()
        .getType() !== 'unstyled'
    ) {
      return true
    }
  }

  return false
}
