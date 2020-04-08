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

    '.MuiTab-root': {
      minWidth: '7rem'
    },
    '.MuiTabs-indicator': {
      height: 3
    },

    '.MuiInputBase-root label, .MuiFormControlLabel-root': {
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
    },
    '.MuiOutlinedInput-input[type="time"]': {
      minWidth: '7rem'
    },
    // ///////////////////////

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
    '.MuiButton-outlined:not(.MuiButton-outlinedPrimary, .MuiButton-outlinedSecondary)': {
      borderColor: theme.palette.common.black
    }
  }
}))(() => null)
