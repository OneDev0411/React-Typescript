import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

export const useChipStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      error: {
        background: fade(theme.palette.error.light, 0.2)
      },
      'margin--small': {
        margin: theme.spacing(0.75, 0.25)
      },
      dark: {
        '&.MuiChip-root': {
          backgroundColor: fade(theme.palette.common.black, 0.12)
        },
        '& .MuiChip-deleteIcon': {
          color: theme.palette.grey[600],

          '&:hover': {
            color: theme.palette.grey[700]
          }
        }
      }
    }),
  { name: 'Chip' }
)
