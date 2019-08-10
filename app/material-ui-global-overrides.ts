import { Theme, withStyles } from '@material-ui/core'

export const MaterialUiGlobalOverrides = withStyles((theme: Theme) => ({
  // @global is handled by jss-plugin-global.
  '@global': {
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    '.MuiButton-root': {
      boxShadow: 'none'
    },

    // override our default styles
    '.MuiLink-underlineNone': {
      textDecoration: 'none!important'
    },
    '.MuiListSubheader-root': {
      textTransform: 'uppercase'
    },
    '.MuiTab-root': {
      minWidth: '8rem'
    },
    '.MuiInputBase-root label': {
      // neutralize bootstrap styles!
      marginBottom: 'initial'
    },
    '.MuiAvatar-root': {
      background: theme.palette.common.black,
      color: theme.palette.common.white,
      fill: theme.palette.common.white
    },
    '.MuiOutlinedInput-notchedOutline legend': {
      // neutralize bootstrap styles!
      border: 'none'
    }
  }
}))(() => null)
