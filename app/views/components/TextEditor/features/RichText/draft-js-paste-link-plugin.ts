import { DraftHandleValue, EditorState } from 'draft-js'
import { DraftJsPlugin, PluginFunctions } from 'draft-js-plugins-editor'
import isEmail from 'validator/lib/isEmail'
import isURL from 'validator/lib/isURL'

import { createLink } from '../../utils/create-link'

import { normalizeUrl } from './LinkEditorPopover/utils'

export default function createPasteLinkPlugin(): DraftJsPlugin {
  return {
    handlePastedText: (
      text,
      html,
      editorState: EditorState,
      { setEditorState }: PluginFunctions
    ): DraftHandleValue => {
      text = text.trim()

      if ((!html && isURL(text)) || isEmail(text)) {
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
