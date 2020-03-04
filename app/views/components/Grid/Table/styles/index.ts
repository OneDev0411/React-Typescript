import { createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const styles = (theme: Theme) =>
  createStyles({
    row: {
      '& td': {
        '& a': {
          color: theme.palette.text.primary,
          textDecoration: 'none'
        },
        '&.opaque': {
          color: theme.palette.grey['500']
        },
        '&.visible-on-hover': {
          opacity: 0
        }
      },
      '&:hover td': {
        '& a': {
          color: theme.palette.secondary.main,
          textDecoration: 'none'
        },
        '&.opaque': {
          color: theme.palette.text.primary
        },
        '&.visible-on-hover': {
          opacity: 1
        }
      }
    }
  })

export const useGridStyles = makeStyles(styles)
