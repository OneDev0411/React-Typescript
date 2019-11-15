import { createStyles, makeStyles } from '@material-ui/core'

/**
 * Suitable when the drawer should not block the UI on the background.
 * scroll events on backdrop are passed through.
 * IMPORTANT: {@link DrawerProps#hideBackdrop} is expected to be used
 * with this. However it's not technically required.
 */
export const useNonBlockingDrawerStyles = makeStyles(
  () =>
    createStyles({
      root: {
        pointerEvents: 'none'
      },
      paper: {
        pointerEvents: 'fill'
      }
    }),
  { name: 'NonBlockingDrawer' }
)
