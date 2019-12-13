import React, { useRef } from 'react'
import { Tooltip } from '@material-ui/core'
import createEmojiPlugin from 'draft-js-emoji-plugin'
import EmojiSelectPopover from 'draft-js-emoji-plugin/lib/components/EmojiSelect/Popover'
import defaultEmojiGroups from 'draft-js-emoji-plugin/lib/constants/defaultEmojiGroups'
import createEmojisFromStrategy from 'draft-js-emoji-plugin/lib/utils/createEmojisFromStrategy'
import strategy from 'emojione/emoji.json'
import { mergeWith } from 'lodash'

import { useLatestValueRef } from 'hooks/use-latest-value-ref'

import IconEmoji from 'components/SvgIcons/Emoji/IconEmoji'

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
import { ToolbarIconButton } from '../../components/ToolbarIconButton'

import { useEditor } from '../../hooks/use-editor'

import { BaseDropdown } from '../../../BaseDropdown'

const emojis = createEmojisFromStrategy(strategy)
const imagePath = '//cdn.jsdelivr.net/emojione/assets/svg/'
const cacheBustParam = '?v=2.2.7'
const imageType = 'svg'
const toneSelectOpenDelay = 500

interface Props {
  /**
   * If true, emoji suggestion popover will be closed upon selecting an emoji.
   * defaults to true
   */
  closeOnSelection?: boolean
}

export function EmojiFeature({ closeOnSelection = true }: Props) {
  const emojiTheme = useEmojiStyles()

  const { setEditorState, editorState } = useEditor()
  const editorStateRef = useLatestValueRef(editorState)
  const storeRef = useRef({
    setEditorState,
    getEditorState: () => editorStateRef.current
  })

  const theme = mergeWith(
    defaultTheme,
    emojiTheme,
    {
      emojiSelectPopoverGroups: 'emoji-group' // for closing on click
    },
    (value1, value2, value3) =>
      [value1, value2, value3].filter(i => i).join(' ')
  )
  const { emojiPlugin } = useEditorPlugins(
    () => ({
      emojiPlugin: createEmojiPlugin({
        theme,
        positionSuggestions: getEmojiSuggestionsPosition
        // imagePath: 'https://ssl.gstatic.com/mail/emoji/v7/png48/emoji_u',
        // imageType: 'png'
      })
    }),
    []
  )
  const { EmojiSuggestions } = emojiPlugin

  return (
    <>
      <ToolbarFragment group="emoji">
        <BaseDropdown
          renderDropdownButton={({ isActive, onClick, ref }) => (
            <Tooltip title="Emoji (:)">
              <ToolbarIconButton
                color={isActive ? 'primary' : undefined}
                ref={ref}
                onClick={onClick}
              >
                <IconEmoji />
              </ToolbarIconButton>
            </Tooltip>
          )}
          PopperProps={{ placement: 'bottom' }}
          renderMenu={({ close }) => (
            <div
              onClick={e => {
                if (
                  closeOnSelection &&
                  (e.target as HTMLElement).closest('.emoji-group')
                ) {
                  close()
                }
              }}
            >
              <EmojiSelectPopover
                cacheBustParam={cacheBustParam}
                imagePath={imagePath}
                imageType={imageType}
                theme={theme}
                store={storeRef.current}
                groups={defaultEmojiGroups}
                emojis={emojis}
                toneSelectOpenDelay={toneSelectOpenDelay}
                isOpen
              />
            </div>
          )}
        />
      </ToolbarFragment>
      <EmojiSuggestions />
    </>
  )
}
