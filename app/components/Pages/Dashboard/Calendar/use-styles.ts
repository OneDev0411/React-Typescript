import { createStyles, makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexFlow: 'column',
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden'
    },
    topSide: {
      flex: '0 1 auto',
      padding: theme.spacing(0, 4)
    },
    listContainer: {
      flex: '1 1 auto',
      padding: theme.spacing(0, 4)
    }
  })
)
