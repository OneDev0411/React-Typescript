import React from 'react'
import { Tooltip } from '@material-ui/core'
import { mergeClasses } from '@material-ui/styles'
import createEmojiPlugin from 'draft-js-emoji-plugin'

import { ToolbarFragment } from '../../components/ToolbarFragment'
import { useEditorPlugins } from '../../hooks/use-editor-plugins'
import { defaultTheme } from './default-emoji-theme'
import { getEmojiSuggestionsPosition } from '../../utils/get-emoji-suggestions-position'
import { useEmojiStyles } from './use-emoji-styles'
/**
 * NOTE: v2.1.2 works while v2.1.3 has breaking changes and is only compatible
 * with the latest version of draft-js, not the version we use right now
 */
import 'draft-js-emoji-plugin/lib/plugin.css'

export function EmojiFeature() {
  const emojiTheme = useEmojiStyles()

  const { emojiPlugin } = useEditorPlugins(
    () => ({
      emojiPlugin: createEmojiPlugin({
        theme: mergeClasses({
          baseClasses: defaultTheme,
          newClasses: emojiTheme,
          Component: null
        }),
        positionSuggestions: getEmojiSuggestionsPosition
        // imagePath: 'https://ssl.gstatic.com/mail/emoji/v7/png48/emoji_u',
        // imageType: 'png'
      })
    }),
    []
  )
  const { EmojiSuggestions, EmojiSelect } = emojiPlugin

  return (
    <>
      <ToolbarFragment>
        <Tooltip title="Emoji (:)">
          <span>
            <EmojiSelect />
          </span>
        </Tooltip>
      </ToolbarFragment>
      <EmojiSuggestions />
    </>
  )
}
