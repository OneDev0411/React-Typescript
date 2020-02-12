import { createStyles, makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100vh',
      overflow: 'hidden'
    },
    listContainer: {
      marginTop: theme.spacing(2)
    }
  })
)
