import { createStyles, Theme } from '@material-ui/core'

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '100%',
      maxHeight: '100%',
      height: '100%'
    },
    container: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      flexDirection: 'column'
    },
    topFields: {
      overflow: 'auto',
      maxHeight: '70%'
    }
  })
