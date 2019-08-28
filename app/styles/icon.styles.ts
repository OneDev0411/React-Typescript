import { createStyles, makeStyles, Theme } from '@material-ui/core'

export const useIconStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      rightMargin: {
        marginRight: `${theme.spacing(1)}px`
      },
      leftMargin: {
        marginRight: `${theme.spacing(1)}px`
      }
    }),
  { name: 'Icon' }
)
