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
    },
    header: {
      height: '40px',
      opacity: '75%',
      display: 'flex',
      flexDirection: 'row',
      borderTop: `1px solid ${theme.palette.grey[100]}`,
      borderLeft: `1px solid ${theme.palette.grey[100]}`,
      alignItems: 'stretch',
      justifyContent: 'space-between',
      ...theme.typography.body2,

      '& > div': {
        height: '100%',
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
        paddingLeft: `${theme.spacing(2)}px`,
        backgroundColor: `${theme.palette.grey[50]}`,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderRight: `1px solid ${theme.palette.divider}`
      }
    },
    headerHasSelected: {
      '& > div:first-child': {
        borderLeft: `1px solid ${theme.palette.divider}`,
        borderRight: 'none'
      }
    }
  })

export const useGridStyles = makeStyles(styles, {
  name: 'grid-default-styles'
})
