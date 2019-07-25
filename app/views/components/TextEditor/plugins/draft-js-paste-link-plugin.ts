import isURL from 'validator/lib/isURL'
import { DraftHandleValue, EditorState } from 'draft-js'
import { PluginFunctions } from 'draft-js-plugins-editor'

import { createLink } from '../utils/create-link'
import { normalizeUrl } from '../components/LinkEditorPopover/utils'

export default function createPasteLinkPlugin() {
  return {
    handlePastedText: (
      text,
      styles,
      editorState: EditorState,
      { setEditorState }: PluginFunctions
    ): DraftHandleValue => {
      console.log(text, styles, editorState)

      if (isURL(text)) {
        const url = normalizeUrl(text)

        setEditorState(
          editorState.getSelection().isCollapsed()
            ? createLink(editorState, url, text)
            : createLink(editorState, url)
        )

        return 'handled'
      }

      return 'not-handled'
    }
  }
}
