import { alpha, createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const gridStyles = (theme: Theme) =>
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
    header: {},
    headerHasSelected: {}
  })

export const inlineGridStyles = (theme: Theme) =>
  createStyles({
    row: {
      '& .column': {
        '& a:not([role="button"])': {
          color: theme.palette.text.primary
        },
        '&.visible-on-hover > *': {
          visibility: 'hidden'
        }
      },
      '&:hover .column': {
        cursor: 'pointer',
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
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      ...theme.typography.body2,

      '& > div': {
        height: '100%',
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: `${alpha(theme.palette.grey[50], 0.75)}`,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderRight: `1px solid ${theme.palette.divider}`
      },
      '& > div:first-child': {
        borderRight: 'none'
      }
    },
    headerHasSelected: {}
  })

export const useGridStyles = makeStyles(gridStyles, {
  name: 'grid-default-styles'
})

export const useInlineGridStyles = makeStyles(inlineGridStyles, {
  name: 'inline-grid-default-styles'
})
