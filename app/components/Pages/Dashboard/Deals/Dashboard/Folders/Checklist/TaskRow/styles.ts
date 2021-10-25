import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative'
    },
    row: {
      position: 'relative',
      paddingLeft: theme.spacing(2),
      minHeight: theme.spacing(8),
      '& .visible-on-hover': {
        display: 'none'
      },
      '&:hover .visible-on-hover': {
        display: 'inherit'
      },
      '&:hover .hide-on-hover': {
        display: 'none'
      },
      '&:hover': {
        backgroundColor: theme.palette.info.ultralight
      }
    },
    divider: {
      width: '100%',
      margin: theme.spacing(0, 2),
      borderBottom: `1px solid ${theme.palette.grey[100]}`
    },
    iconContainer: {
      margin: theme.spacing(0, 1.5)
    },
    actions: {
      position: 'absolute',
      right: theme.spacing(2),
      height: '100%'
    },
    title: {
      ...theme.typography.body2,
      lineHeight: 1,
      marginRight: theme.spacing(1)
    },
    link: {
      color: '#000',
      '&:hover': {
        cursor: 'pointer',
        color: theme.palette.secondary.main
      }
    },
    verticalGuideLine: {
      position: 'absolute',
      left: theme.spacing(3),
      top: theme.spacing(6),
      bottom: theme.spacing(4),
      width: '1px',
      borderLeft: `1px dashed ${theme.palette.grey['500']}`
    },
    caption: {
      color: theme.palette.grey['700']
    }
  }),
  {
    name: 'Checklists-TaskRow'
  }
)
