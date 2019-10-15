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
      },
      medium: {
        'svg&': {
          // More specificity to beat styled-svg styles
          width: 24,
          height: 24,
          minWidth: 24
        }
      }
    }),
  { name: 'Icon' }
)
