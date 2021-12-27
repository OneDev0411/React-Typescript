import { makeStyles } from '@material-ui/core'
import { createStyles } from '@material-ui/styles'

export const useStyles = makeStyles(
  theme =>
    createStyles({
      container: {
        margin: theme.spacing(5)
      },
      headerContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end'
      },
      filtersContainer: {
        margin: theme.spacing(5, 0)
      }
    }),
  { name: 'DealsListBackOffice' }
)
