import { Theme, makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(2, 0)
    },
    multiSelectionRenderer: {
      padding: theme.spacing(1, 0),
      cursor: 'pointer'
    },
    disabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  }),
  { name: 'BrandSelectorDrawer' }
)
