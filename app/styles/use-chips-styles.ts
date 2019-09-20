import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

export const useChipStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      error: {
        background: fade(theme.palette.error.light, 0.2)
      }
    }),
  { name: 'Chip' }
)
