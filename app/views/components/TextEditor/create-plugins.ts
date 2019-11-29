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
/**
 * NOTE: v2.1.2 works while v2.1.3 has breaking changes and is only compatible
 * with the latest version of draft-js, not the version we use right now
 */
import createEmojiPlugin from 'draft-js-emoji-plugin'
import 'draft-js-emoji-plugin/lib/plugin.css'

import { mergeClasses } from '@material-ui/styles'

import createSignaturePlugin, {
  SignatureContentOption
} from './plugins/draft-js-signature-plugin'
import createPasteLinkPlugin from './plugins/draft-js-paste-link-plugin'
import { linkKeyBinding } from './utils/link-key-binding'

import { withUploadingIndicator } from './block-decorators/with-uploading-indicator'
import { resizablePluginOptions } from './config'
import createIframePlugin from './plugins/draft-js-iframe-plugin'
import { createCollapsibleDecorator } from './block-decorators/create-collapsible-decorator'
import createPasteHtmlPlugin from './plugins/draft-js-paste-html'
import { getHtmlConversionOptions } from './utils/get-html-conversion-options'
import { atomicBlockLinkDecorator } from './block-decorators/atomic-block-link-decorator'
import { resizableBugFixDecorator } from './block-decorators/resizable-bug-fix-decorator'
import { defaultTheme } from './default-emoji-theme'
import { getEmojiSuggestionsPosition } from './utils/get-emoji-suggestions-position'

export function createPlugins(
  setLinkEditorOpen: (open: boolean) => void,
  signature: SignatureContentOption,
  stateFromHtmlOptions,
  emojiTheme
) {
  const focusPlugin = createFocusPlugin({
    theme: { focused: 'focused', unfocused: 'unfocused' }
  })
  const resizeablePlugin = createResizeablePlugin(resizablePluginOptions)
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

  const iframePlugin = createIframePlugin({
    decorator: composeDecorators(
      createCollapsibleDecorator({ defaultCollapsed: true })
    )
  })

  const imagePlugin = createImagePlugin({
    decorator: composeDecorators(
      withUploadingIndicator,
      resizableBugFixDecorator,
      resizeablePlugin.decorator,
      atomicBlockLinkDecorator,
      alignmentPlugin.decorator,
      focusPlugin.decorator,
      blockDndPlugin.decorator
    )
  })
  const pasteHtmlPlugin = createPasteHtmlPlugin({
    stateFromHtmlOptions: editorState =>
      getHtmlConversionOptions(editorState).stateFromHtmlOptions
  })

  const emojiPlugin = createEmojiPlugin({
    theme: mergeClasses({
      baseClasses: defaultTheme,
      newClasses: emojiTheme,
      Component: null
    }),
    positionSuggestions: getEmojiSuggestionsPosition
    // imagePath: 'https://ssl.gstatic.com/mail/emoji/v7/png48/emoji_u',
    // imageType: 'png'
  })
  const { EmojiSuggestions, EmojiSelect } = emojiPlugin

  return {
    AlignmentTool,
    richButtonsPlugin,
    focusPlugin,
    resizeablePlugin,
    blockDndPlugin,
    alignmentPlugin,
    linkPlugins: [anchorPlugin, createPasteLinkPlugin(), linkShortcutsPlugin],
    imagePlugin,
    iframePlugin,
    pasteHtmlPlugin,
    signaturePlugin,
    emojiPlugin,
    EmojiSuggestions,
    EmojiSelect
  }
}
