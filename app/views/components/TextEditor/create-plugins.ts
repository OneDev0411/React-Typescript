import { composeDecorators } from 'draft-js-plugins-editor'

import createFocusPlugin from 'draft-js-focus-plugin'

import createResizeablePlugin from 'draft-js-resizeable-plugin'

import createAnchorPlugin from 'draft-js-anchor-plugin'

import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin'

import createImagePlugin from 'draft-js-image-plugin'
import 'draft-js-image-plugin/lib/plugin.css'

import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'

import createAlignmentPlugin from 'draft-js-alignment-plugin'
import 'draft-js-alignment-plugin/lib/plugin.css'

import createSignaturePlugin, {
  SignatureContentOption
} from './plugins/draft-js-signature-plugin'
import createPasteLinkPlugin from './plugins/draft-js-paste-link-plugin'
import { linkKeyBinding } from './utils/link-key-binding'

import { withUploadingIndicator } from './block-decorators/with-uploading-indicator'

export function createPlugins(
  setLinkEditorOpen: (open: boolean) => void,
  signature: SignatureContentOption,
  stateFromHtmlOptions
) {
  const focusPlugin = createFocusPlugin({
    theme: { focused: 'focused', unfocused: 'unfocused' }
  })
  const resizeablePlugin = createResizeablePlugin()
  const blockDndPlugin = createBlockDndPlugin()
  const alignmentPlugin = createAlignmentPlugin()
  const { AlignmentTool } = alignmentPlugin
  const richButtonsPlugin = createRichButtonsPlugin()
  const anchorPlugin = createAnchorPlugin()

  // Can be extracted into a separate plugin file
  const linkShortcutsPlugin = {
    handleKeyCommand: command => {
      command === 'link' && setLinkEditorOpen(true)
    },
    keyBindingFn: linkKeyBinding
  }

  const signaturePlugin = createSignaturePlugin({
    signatureContent: signature || '',
    stateFromHtmlOptions
  })

  return {
    AlignmentTool,
    richButtonsPlugin,
    focusPlugin,
    resizeablePlugin,
    blockDndPlugin,
    alignmentPlugin,
    linkPlugins: [anchorPlugin, createPasteLinkPlugin(), linkShortcutsPlugin],
    imagePlugin: createImagePlugin({
      decorator: composeDecorators(
        withUploadingIndicator,
        resizeablePlugin.decorator,
        alignmentPlugin.decorator,
        focusPlugin.decorator,
        blockDndPlugin.decorator
      )
    }),
    signaturePlugin
  }
}
