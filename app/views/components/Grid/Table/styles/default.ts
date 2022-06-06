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
      '&.selected .column': {
        backgroundColor: theme.palette.action.hover
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
      },
      '& .inline-edit': {
        position: 'relative',
        '& .inline-edit-icon': {
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          visibility: 'hidden',
          background: theme.palette.common.white,
          boxShadow: theme.shadows[1],
          '&.open': {
            visibility: 'visible'
          }
        },
        '&:hover .inline-edit-icon': {
          visibility: 'visible'
        },
        '&:hover': {
          boxShadow: `inset 0px 0px 0px 2px ${theme.palette.primary.main} !important`,
          borderRadius: theme.shape.borderRadius
        }
      }
    }
  })

export const useGridStyles = makeStyles(styles, {
  name: 'grid-default-styles'
})
