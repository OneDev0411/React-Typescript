import { createStyles, Theme } from '@material-ui/core'

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '100%',
      maxHeight: '100%',
      height: '100%',
      overflow: 'hidden'
    },
    container: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      flexDirection: 'column',
      padding: theme.spacing(0, 3)
    },
    topFields: {
      overflow: 'auto',
      paddingBottom: '1px', // For Safari!
      maxHeight: '70%'
    },
    footer: {}
  })
