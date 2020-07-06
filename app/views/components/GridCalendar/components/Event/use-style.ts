import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(0.25, 0.5),
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ...theme.typography.body3
    },
    general: {
      background: 'trasnparent',
      color: theme.palette.tertiary.dark
    },
    multiDay: {
      background: '#f2f2f2',
      color: theme.palette.tertiary.dark
    },
    celebration: {
      background: '#fce6fa',
      color: '#ff00cc'
    },
    deal: {
      background: '#f8f8ff',
      color: '#0945eb'
    }
  }),
  {
    name: 'GridCalendarEvent'
  }
)
