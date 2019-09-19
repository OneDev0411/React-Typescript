import { createStyles, makeStyles, Theme } from '@material-ui/core'

export const useEmailFormStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        display: 'flex',
        flexDirection: 'column',
        flexBasis: '100%',
        maxHeight: '100%'
      },
      topFields: {
        overflow: 'auto',
        maxHeight: '70%'
      }
    }),
  { name: 'EmailForm' }
)
