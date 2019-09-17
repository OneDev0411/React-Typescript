import { createStyles, makeStyles, Theme } from '@material-ui/core'

export const useIconStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      rightMargin: {
        marginRight: `${theme.spacing(1)}px`
      },
      leftMargin: {
        marginLeft: `${theme.spacing(1)}px`
      },
      small: {
        'svg&': {
          // More specificity to beat styled-svg styles
          width: 16,
          height: 16,
          minWidth: 16
        }
      }
    }),
  { name: 'Icon' }
)
