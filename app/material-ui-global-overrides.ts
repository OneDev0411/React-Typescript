import { withStyles } from '@material-ui/core'

export const MaterialUiGlobalOverrides = withStyles({
  // @global is handled by jss-plugin-global.
  '@global': {
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    '.MuiButton-root': {
      boxShadow: 'none'
    }
  }
})(() => null)
