import { composeDecorators } from 'draft-js-plugins-editor'

import createAnchorPlugin from 'draft-js-anchor-plugin'

import 'draft-js-image-plugin/lib/plugin.css'

import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'

import 'draft-js-alignment-plugin/lib/plugin.css'
/**
 * NOTE: v2.1.2 works while v2.1.3 has breaking changes and is only compatible
 * with the latest version of draft-js, not the version we use right now
 */
import createEmojiPlugin from 'draft-js-emoji-plugin'
import 'draft-js-emoji-plugin/lib/plugin.css'

import { mergeClasses } from '@material-ui/styles'

import createPasteLinkPlugin from './plugins/draft-js-paste-link-plugin'
import { linkKeyBinding } from './utils/link-key-binding'

import createIframePlugin from './plugins/draft-js-iframe-plugin'
import { createCollapsibleDecorator } from './block-decorators/create-collapsible-decorator'
import createPasteHtmlPlugin from './plugins/draft-js-paste-html'
import { getHtmlConversionOptions } from './utils/get-html-conversion-options'
import { defaultTheme } from './default-emoji-theme'
import { getEmojiSuggestionsPosition } from './utils/get-emoji-suggestions-position'

export function createPlugins(
  setLinkEditorOpen: (open: boolean) => void,
  stateFromHtmlOptions,
  emojiTheme
) {
  const richButtonsPlugin = createRichButtonsPlugin()
  const anchorPlugin = createAnchorPlugin()

  // Can be extracted into a separate plugin file
  const linkShortcutsPlugin = {
    handleKeyCommand: command => {
      command === 'link' && setLinkEditorOpen(true)
    },
    keyBindingFn: linkKeyBinding
  }

  const iframePlugin = createIframePlugin({
    decorator: composeDecorators(
      createCollapsibleDecorator({ defaultCollapsed: true })
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
    richButtonsPlugin,
    linkPlugins: [anchorPlugin, createPasteLinkPlugin(), linkShortcutsPlugin],
    iframePlugin,
    pasteHtmlPlugin,
    emojiPlugin,
    EmojiSuggestions,
    EmojiSelect
  }
}
