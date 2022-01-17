import { createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const styles = (theme: Theme) =>
  createStyles({
    row: {
      '& .column': {
        '& a:not([role="button"])': {
          color: theme.palette.text.primary
        },
        '&.opaque': {
          color: theme.palette.grey['500']
        },
        '&.visible-on-hover > *': {
          visibility: 'hidden'
        }
      },
      '&:hover .column': {
        cursor: 'pointer',
        '&.primary a': {
          color: theme.palette.secondary.main,
          textDecoration: 'underline'
        },
        '&.opaque': {
          color: theme.palette.text.primary
        },
        '&.visible-on-hover > *': {
          visibility: 'visible'
        },
        '& .underline-on-hover': {
          textDecoration: 'underline',
          color: theme.palette.secondary.main
        }
      }
    }
  })

const gridStyles = (theme: Theme) =>
  createStyles({
    row: {
      '& .column': {
        '& a:not([role="button"])': {
          color: theme.palette.text.primary
        },
        '&.opaque': {
          color: theme.palette.grey['500']
        },
        '&.visible-on-hover > *': {
          visibility: 'hidden'
        }
      },
      '&:hover .column': {
        cursor: 'pointer',
        '&.primary a': {
          color: theme.palette.secondary.main,
          textDecoration: 'underline'
        },
        '&.opaque': {
          color: theme.palette.text.primary
        },
        '&.visible-on-hover > *': {
          visibility: 'visible'
        },
        '& .underline-on-hover': {
          textDecoration: 'underline',
          color: theme.palette.secondary.main
        }
      }
    }
  })

export const useGridStyles = ({ inlineGridEnabled = false }) =>
  makeStyles(inlineGridEnabled ? gridStyles : styles, {
    name: 'grid-default-styles'
  })()
