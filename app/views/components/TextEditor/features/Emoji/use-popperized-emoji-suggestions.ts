import { EmojiPluginConfig } from 'draft-js-emoji-plugin'
import { useTheme } from '@material-ui/core'
import { useCallback, useRef, useState } from 'react'
import PopperJs from 'popper.js'

import { PopperProps } from '@material-ui/core/Popper'

import { useLatestValueRef } from 'hooks/use-latest-value-ref'

import { ReferenceObject } from '../../types'

type UsePopperizedEmojiSuggestions = {
  PopperProps: Omit<PopperProps, 'children'>
  positionSuggestions: EmojiPluginConfig['positionSuggestions']
  EmojiSuggestionProps: { onClose: () => void }
}

/**
 * A react hook which enables using EmojiSuggestions in a Popper.
 * Why embedding EmojiSuggestions into Popper?
 *  - Because default positioning of EmojiSuggestions is not perfect and
 *    if editor is near the edges of the viewport, suggestions can easily
 *    get off screen.
 *  - Because rendering Suggestions in a portal fixes all overflow issues
 *    that may happen if the editor is not large enough to fit the suggestions
 *    popover in it and its overflow is 'hidden'.
 */
export function usePopperizedEmojiSuggestions(): UsePopperizedEmojiSuggestions {
  const theme = useTheme()
  const popperRef = useRef<PopperJs>(null)
  const [anchorEl, setAnchorEl] = useState<ReferenceObject | null>(null)
  const anchorElRef = useLatestValueRef(anchorEl)

  const positionSuggestions: EmojiPluginConfig['positionSuggestions'] = useCallback(
    ({ decoratorRect, state: { isActive } }) => {
      const prevRect =
        anchorElRef.current && anchorElRef.current.getBoundingClientRect()
      const targetChanged =
        !prevRect ||
        prevRect.left !== decoratorRect.left ||
        prevRect.right !== decoratorRect.right ||
        prevRect.top !== decoratorRect.top ||
        prevRect.bottom !== decoratorRect.bottom

      if (targetChanged) {
        setAnchorEl({
          clientHeight: decoratorRect.height,
          clientWidth: decoratorRect.width,
          getBoundingClientRect: () => decoratorRect
        })
      }

      if (popperRef.current) {
        popperRef.current.update()
      }

      return {}
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps: anchorElRef is ref!
    [anchorElRef]
  )

  return {
    positionSuggestions,
    PopperProps: {
      open: !!anchorEl,
      style: { zIndex: theme.zIndex.modal },
      placement: 'bottom-start',
      /**
       * because Popper doesn't render its children by default and therefore
       * without this onOpen and positionSuggestions are never gonna be called.
       */
      keepMounted: true,
      anchorEl,
      popperRef
    },
    EmojiSuggestionProps: {
      onClose: () => setAnchorEl(null)
    }
  }
}
