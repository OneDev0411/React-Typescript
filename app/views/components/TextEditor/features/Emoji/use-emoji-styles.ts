import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { EmojiPluginTheme } from 'draft-js-emoji-plugin'

/**
 * emoji plugin accepts an object as `theme`, which can contain a bunch of
 * class names for various pieces in the emoji plugin UI. because of its
 * analogy
 */
export const useEmojiStyles = makeStyles(
  (theme: Theme) => {
    return createStyles({
      emojiSelectPopover: {
        position: 'static!important'
      },
      emojiSuggestions: {
        transform: 'none !important',
        position: 'static!important',
        marginTop: '0 !important'
      }
    } as Record<keyof EmojiPluginTheme, any>)
  },
  { name: 'Emoji' }
)
