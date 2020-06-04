import { Theme, withStyles } from '@material-ui/core'

export const MaterialUiGlobalOverrides = withStyles((theme: Theme) => ({
  // @global is handled by jss-plugin-global.
  '@global': {
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    '.MuiButtonBase-root': {
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none'
      }
    },

    '.MuiIconButton-root': {
      // because of disabling ripple globally
      '&.Mui-focusVisible': {
        background: theme.palette.action.selected
      }
    },

    '.MuiTableHead-root': {
      textTransform: 'uppercase'
    },

    // override our default styles
    '.MuiLink-underlineNone': {
      textDecoration: 'none!important'
    },
    '.MuiListSubheader-root': {
      textTransform: 'uppercase'
    },

    '.MuiInputBase-root label, .MuiFormControlLabel-root': {
      // neutralize bootstrap styles!
      marginBottom: 'initial'
    },
    '.MuiOutlinedInput-notchedOutline legend': {
      // neutralize bootstrap styles!
      border: 'none'
    },
    '.MuiOutlinedInput-input[type="time"]': {
      minWidth: '7rem'
    },

    '.MuiLinearProgress-root': {
      height: '1rem',
      borderRadius: theme.shape.borderRadius
    },
    '.MuiTooltip-tooltip': {
      background: theme.palette.common.black,
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.body1.fontWeight,
      padding: theme.spacing(1, 1.5)
    },
    '.MuiTooltip-arrow': {
      color: theme.palette.common.black
    },
    '.MuiAvatar-colorDefault': {
      color: theme.palette.common.black
    }
  }
}))(() => null)
