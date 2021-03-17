import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  () => ({
    container: {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 100,
      overflowY: 'scroll',
      backgroundColor: '#fff'
    },
    root: {
      width: '80%',
      maxWidth: '800px',
      margin: '15% auto'
    }
  }),
  {
    name: 'DealCreateFlows'
  }
)
