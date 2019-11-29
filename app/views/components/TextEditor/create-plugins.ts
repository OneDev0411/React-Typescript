import { composeDecorators } from 'draft-js-plugins-editor'

import 'draft-js-image-plugin/lib/plugin.css'

import 'draft-js-alignment-plugin/lib/plugin.css'
/**
 * NOTE: v2.1.2 works while v2.1.3 has breaking changes and is only compatible
 * with the latest version of draft-js, not the version we use right now
 */
import createEmojiPlugin from 'draft-js-emoji-plugin'
import 'draft-js-emoji-plugin/lib/plugin.css'

import { mergeClasses } from '@material-ui/styles'

import createIframePlugin from './plugins/draft-js-iframe-plugin'
import { createCollapsibleDecorator } from './block-decorators/create-collapsible-decorator'
import createPasteHtmlPlugin from './plugins/draft-js-paste-html'
import { getHtmlConversionOptions } from './utils/get-html-conversion-options'
import { defaultTheme } from './default-emoji-theme'
import { getEmojiSuggestionsPosition } from './utils/get-emoji-suggestions-position'

export function createPlugins(stateFromHtmlOptions, emojiTheme) {
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
    iframePlugin,
    pasteHtmlPlugin,
    emojiPlugin,
    EmojiSuggestions,
    EmojiSelect
  }
}
