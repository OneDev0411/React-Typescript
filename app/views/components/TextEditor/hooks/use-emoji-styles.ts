import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { EmojiPluginTheme } from 'draft-js-emoji-plugin'
import { CSSProperties } from 'react'

/**
 * emoji plugin accepts an object as `theme`, which can contain a bunch of
 * class names for various pieces in the emoji plugin UI. because of its
 * analogy
 */
export const useEmojiStyles = makeStyles(
  (theme: Theme) => {
    const buttonStyles: CSSProperties = {
      paddingBottom: theme.spacing(0.5),
      height: '2rem',
      width: '2rem',
      border: 'none',
      color: theme.palette.grey['800']
    }

    return createStyles({
      emojiSelectButtonPressed: {
        'button&': {
          ...buttonStyles
        }
      },
      emojiSelectButton: {
        'button&': {
          ...buttonStyles,
          '&:hover': {
            background: theme.palette.action.hover
          }
        }
      },
      emojiSelect: {
        position: 'relative'
      },
      emojiSelectPopover: {
        left: '50%',
        transform: 'translateX(-50%)'
      }
    } as Record<keyof EmojiPluginTheme, any>)
  },
  { name: 'Emoji' }
)
