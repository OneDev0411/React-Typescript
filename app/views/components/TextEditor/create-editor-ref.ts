import { RefObject } from 'react'
import PluginsEditor from 'draft-js-plugins-editor'
import { convertToRaw, EditorState } from 'draft-js'
import {
  Options as StateFromHtmlOptions,
  stateFromHTML
} from 'draft-js-import-html'
import {
  Options as StateToHtmlOptions,
  stateToHTML
} from 'draft-js-export-html'

export const createEditorRef = ({
  editorElementRef,
  editorRef,
  handleChange,
  stateToHtmlOptions,
  stateFromHtmlOptions
}: {
  editorElementRef: RefObject<HTMLElement>
  editorRef: RefObject<PluginsEditor>
  handleChange: (editorState: EditorState) => void
  stateToHtmlOptions: StateToHtmlOptions
  stateFromHtmlOptions: StateFromHtmlOptions
}) => () => ({
  // convenient method for resetting editor html content
  reset: (html = '') => {
    handleChange(
      EditorState.createWithContent(stateFromHTML(html, stateFromHtmlOptions))
    )
  },
  /**
   * update is different from reset, in that it keeps states other than
   * current content, like the undo/redo stack
   * @param html
   */
  update: (html = '') => {
    if (editorRef.current) {
      handleChange(
        EditorState.push(
          editorRef.current.getEditorState(),
          stateFromHTML(html, stateFromHtmlOptions),
          'insert-fragment'
        )
      )
    }
  },
  // convenient method for getting plain text of the editor content
  getPlainText: () => {
    if (editorRef.current) {
      return editorRef.current
        .getEditorState()
        .getCurrentContent()
        .getPlainText()
    }

    return ''
  },
  scrollToEnd: () => {
    const editorWrapper = editorElementRef.current

    if (editorWrapper) {
      editorWrapper.scrollTo(0, editorWrapper.scrollHeight)
    }
  },
  // convenient method for getting html content of the editor
  getHtml: () => {
    if (editorRef.current) {
      return stateToHTML(
        editorRef.current.getEditorState().getCurrentContent(),
        stateToHtmlOptions
      )
    }
  },
  /**
   * returns true if the content includes an image which is being uploaded
   */
  hasUploadingImage: () => {
    if (editorRef.current) {
      const entities = Object.values(
        convertToRaw(editorRef.current.getEditorState().getCurrentContent())
          .entityMap
      )

      return entities.some(
        entity => entity.type === 'IMAGE' && entity.data.uploading
      )
    }
  },
  editorElementRef,
  editorRef
})
