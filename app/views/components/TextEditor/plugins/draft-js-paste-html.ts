import { DraftHandleValue, EditorState, Modifier } from 'draft-js'
import { PluginFunctions } from 'draft-js-plugins-editor'

import { stateFromHTML, Options } from 'draft-js-import-html'

import { fixImageBlockTypes } from '../utils/fix-image-block-types'

/**
 * Draft.js has it's own convertFromHTMLtoContentBlocks which is not
 * configurable and extensible for handling image and stuff like that.
 * So images are not converted back from HTML. This plugin will use
 * {@link stateFromHTML} to convert pasted html to content blocks.
 * It also accepts options to be passed to {@link stateFromHTML}.
 *
 * Some important notes:
 * - DarftJS has some sort of logic to determine if it should
 *   use its internal clipboard for pasting from the editor to itself, without
 *   converting to and from html. Unfortunately, there is no way to provide
 *   custom paste handler and also benefit from this internal clipboard
 *   detection at the same time. So we need to kind of duplicate some logic
 *   there to ensure we don't mess up with this editor-to-editor copy pasting.
 *   We need to determine if this is an editor-to-editor paste. There are some
 *   weird if statements for Safari which we cannot add.
 *
 * - Content insertion code here and in the original paste handler is a bit
 *   different which may or may not cause some problems.
 *
 * - Draftjs's own convertFromHTMLtoContentBlocks does a better job in
 *   conversion from html. some inline styles for example seem to be lost with
 *   this plugin but are  handled properly in the built-in conversion from html.
 */
export default function createPasteHtmlPlugin({
  stateFromHtmlOptions
}: {
  stateFromHtmlOptions?: Options | ((editorState: EditorState) => Options)
}) {
  return {
    handlePastedText: (
      text,
      html,
      editorState: EditorState,
      { setEditorState, getEditorRef }: PluginFunctions
    ): DraftHandleValue => {
      const editor: any = getEditorRef()
      const internalClipboard = editor.getClipboard()

      if (
        html &&
        !editor.props.stripPastedStyles &&
        !(internalClipboard && html.indexOf(editor.getEditorKey()) !== -1)
      ) {
        const options =
          typeof stateFromHtmlOptions === 'function'
            ? stateFromHtmlOptions(editorState)
            : stateFromHtmlOptions

        const state = stateFromHTML(html, options)

        const newContentState = Modifier.replaceWithFragment(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          state.getBlockMap()
        )

        setEditorState(
          EditorState.push(
            editorState,
            fixImageBlockTypes(newContentState),
            'insert-fragment'
          )
        )

        return 'handled'
      }

      return 'not-handled'
    }
  }
}
