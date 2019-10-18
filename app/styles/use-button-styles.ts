import { createStyles, makeStyles, Theme } from '@material-ui/core'

export const useButtonStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      // This is incomplete. based on button variant (outline, raised, ...)
      // appropriate style should be added
      danger: {
        '& svg': {
          fill: theme.palette.error.main
        }
      }
    }),
  { name: 'ButtonStyles' }
)
