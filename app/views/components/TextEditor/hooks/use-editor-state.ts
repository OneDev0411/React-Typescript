import { useMemo, useState } from 'react'

import { convertToRaw, EditorState } from 'draft-js'
import { stateToHTML, Options as ExportOptions } from 'draft-js-export-html'
import { stateFromHTML, Options as ImportOptions } from 'draft-js-import-html'

import { useLatestValueRef } from 'hooks/use-latest-value-ref'

import { getHtmlConversionOptions } from '../utils/get-html-conversion-options'

export interface UseEditorState {
  editorState: EditorState
  setEditorState: (state: EditorState) => void
  stateToHtmlOptions: ExportOptions
  stateFromHtmlOptions: ImportOptions
  reset: (html: string) => void
  update: (html: string) => void
  getPlainText: () => string
  getHtml: () => string
  hasUploadingImage: () => boolean
}

export function useEditorState(HTML: string = ''): UseEditorState {
  const { stateToHtmlOptions, stateFromHtmlOptions } = useMemo(
    () => getHtmlConversionOptions(() => editorStateRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createWithContent(stateFromHTML(HTML, stateFromHtmlOptions))
  )

  const editorStateRef = useLatestValueRef(editorState)

  editorStateRef.current = editorState

  // convenient method for resetting editor html content
  const reset = (html = '') => {
    setEditorState(
      EditorState.createWithContent(stateFromHTML(html, stateFromHtmlOptions))
    )
  }

  /**
   * update is different from reset, in that it keeps states other than
   * current content, like the undo/redo stack
   * @param html
   */
  const update = (html = '') => {
    setEditorState(
      EditorState.push(
        editorStateRef.current,
        stateFromHTML(html, stateFromHtmlOptions),
        'insert-fragment'
      )
    )
  }
  // convenient method for getting plain text of the editor content
  const getPlainText = () => {
    return editorStateRef.current.getCurrentContent().getPlainText()
  }

  // convenient method for getting html content of the editor
  const getHtml = () => {
    return stateToHTML(
      editorStateRef.current.getCurrentContent(),
      stateToHtmlOptions
    )
  }
  /**
   * returns true if the content includes an image which is being uploaded
   */
  const hasUploadingImage = () => {
    const entities = Object.values(
      convertToRaw(editorStateRef.current.getCurrentContent()).entityMap
    )

    return entities.some(
      entity => entity.type === 'IMAGE' && entity.data.uploading
    )
  }

  return {
    editorState,
    setEditorState,
    stateToHtmlOptions,
    stateFromHtmlOptions,
    reset,
    update,
    getPlainText,
    getHtml,
    hasUploadingImage
  }
}
