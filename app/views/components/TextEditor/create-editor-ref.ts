import { RefObject } from 'react'

export const createEditorRef = ({
  editorElementRef
}: {
  editorElementRef: RefObject<HTMLElement>
}) => () => ({
  scrollToEnd: () => {
    const editorWrapper = editorElementRef.current

    if (editorWrapper) {
      editorWrapper.scrollTo(0, editorWrapper.scrollHeight)
    }
  },
  editorElementRef
})
