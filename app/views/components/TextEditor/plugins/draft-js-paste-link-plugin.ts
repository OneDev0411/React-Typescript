import isURL from 'validator/lib/isURL'
import isEmail from 'validator/lib/isEmail'

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
      text = text.trim()

      if (isURL(text) || isEmail(text)) {
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
