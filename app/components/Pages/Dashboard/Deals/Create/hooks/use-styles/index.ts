import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: '80%',
      maxWidth: '800px',
      margin: '15% auto'
    },
    brandedTitle: {
      color: theme.palette.primary.main
    }
  }),
  {
    name: 'DealCreateFlows'
  }
)
