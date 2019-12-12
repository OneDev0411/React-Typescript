import { createStyles, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-block',
      border: '1px solid rgba(0,0,0, .12)',
      borderRadius: theme.shape.borderRadius,
      cursor: 'pointer',
      fontSize: '.8rem',
      lineHeight: 1.2,
      background: theme.palette.grey['300'],
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.primary.dark,
        background: fade(theme.palette.primary.main, 0.12)
      }
    },
    noFallback: {
      color: theme.palette.error.main,
      background: fade(theme.palette.error.main, 0.12)
    },
    icon: {
      width: '0.7rem!important', // to overcome default icon size specificity
      height: '0.7rem!important',
      fill: 'currentColor',
      margin: theme.spacing(0, 0.5, -0.1, 0.5)
    },
    tooltip: {
      padding: theme.spacing(0.5, 1),
      fontSize: theme.typography.caption.fontSize
    }
  })
