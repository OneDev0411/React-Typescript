import { makeStyles, Theme } from '@material-ui/core'

interface StyleProps {
  index: number
}

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative'
    },
    row: ({ index }: StyleProps) => ({
      position: 'relative',
      minHeight: theme.spacing(8),
      backgroundColor: index % 2 === 0 ? theme.palette.grey['50'] : '#fff',
      '& .visible-on-hover': {
        display: 'none'
      },
      '&:hover .visible-on-hover': {
        display: 'block'
      },
      '&:hover .hide-on-hover': {
        display: 'none'
      },
      '&:hover': {
        backgroundColor: theme.palette.info.ultralight
      }
    }),
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
      top: theme.spacing(5),
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
