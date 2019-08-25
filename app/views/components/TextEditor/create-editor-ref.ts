import { RefObject } from 'react'
import PluginsEditor from 'draft-js-plugins-editor'
import { convertToRaw, EditorState } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'
import { stateToHTML } from 'draft-js-export-html'

export const createEditorRef = ({
  editorRef,
  setEditorState,
  stateToHtmlOptions
}: {
  editorRef: RefObject<PluginsEditor>
  setEditorState: (editorState: EditorState) => void
  stateToHtmlOptions: any
}) => () => ({
  // convenient method for resetting editor html content
  reset: (html = '') => {
    setEditorState(EditorState.createWithContent(stateFromHTML(html)))
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
  editorRef
})