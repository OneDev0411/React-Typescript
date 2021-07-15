import React, { useContext, useMemo, useRef } from 'react'

import 'draft-js-emoji-plugin/lib/plugin.css'

import { Popper, Tooltip } from '@material-ui/core'
import { mdiEmoticonHappyOutline } from '@mdi/js'
import createEmojiPlugin from 'draft-js-emoji-plugin'
import EmojiSelectPopover from 'draft-js-emoji-plugin/lib/components/EmojiSelect/Popover'
import defaultEmojiGroups from 'draft-js-emoji-plugin/lib/constants/defaultEmojiGroups'
import createEmojisFromStrategy from 'draft-js-emoji-plugin/lib/utils/createEmojisFromStrategy'
import strategy from 'emojione/emoji.json'
import { mergeWith } from 'lodash'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useLatestValueRef } from 'hooks/use-latest-value-ref'

import { BaseDropdown } from '../../../BaseDropdown'
import { ToolbarFragment } from '../../components/ToolbarFragment'
import { ToolbarIconButton } from '../../components/ToolbarIconButton'
import { EditorContext } from '../../editor-context'
import { useEditorPlugins } from '../../hooks/use-editor-plugins'

import { defaultTheme } from './default-emoji-theme'
import { useEmojiStyles } from './use-emoji-styles'
import { usePopperizedEmojiSuggestions } from './use-popperized-emoji-suggestions'

const emojis = createEmojisFromStrategy(strategy)
const imagePath = '//cdn.jsdelivr.net/emojione/assets/svg/' // google: 'https://ssl.gstatic.com/mail/emoji/v7/png48/emoji_u'
const imageType = 'svg' // google: 'png'
const cacheBustParam = '?v=2.2.7'
const toneSelectOpenDelay = 500

interface Props {
  /**
   * If true, emoji suggestion popover will be closed upon selecting an emoji.
   * defaults to true
   */
  closeOnSelection?: boolean
}

export function EmojiFeature({ closeOnSelection = true }: Props) {
  const { setEditorState, editorState } = useContext(EditorContext)
  const editorStateRef = useLatestValueRef(editorState)
  const storeRef = useRef({
    setEditorState,
    getEditorState: () => editorStateRef.current
  })
  const { EmojiSuggestionProps, PopperProps, positionSuggestions } =
    usePopperizedEmojiSuggestions()

  const emojiTheme = useEmojiStyles()
  const theme = useMemo(
    () =>
      mergeWith(
        {
          emojiSelectPopoverGroups: 'emoji-group' // for closing on click
        },
        defaultTheme,
        emojiTheme,
        (value1, value2, value3) =>
          [value1, value2, value3].filter(i => i).join(' ')
      ),
    [emojiTheme]
  )
  const { emojiPlugin } = useEditorPlugins(
    () => ({
      emojiPlugin: createEmojiPlugin({
        theme,
        positionSuggestions
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
                <SvgIcon path={mdiEmoticonHappyOutline} />
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
      <Popper {...PopperProps}>
        <EmojiSuggestions {...EmojiSuggestionProps} />
      </Popper>
    </>
  )
}
