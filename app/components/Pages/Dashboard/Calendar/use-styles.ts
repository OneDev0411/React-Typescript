import { createStyles, makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexFlow: 'column',
      height: '100vh',
      maxHeight: '100vh',
      padding: theme.spacing(5),
      paddingBottom: 0
    },
    topSide: {
      flex: '0 1 auto',
      marginTop: theme.spacing(4)
    },
    listContainer: {
      margin: theme.spacing(4, 0),
      flex: '1 1 auto'
    }
  })
)
