import { Theme, withStyles } from '@material-ui/core'
import cssTriangle from 'css-triangle'

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

    '@media(min-width: 960px)': {
      '.MuiTab-root': {
        fontSize: '0.875rem'
      }
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

    '.MuiLinearProgress-root': {
      height: '1rem',
      borderRadius: theme.shape.borderRadius
    },
    '.MuiTooltip-tooltip': {
      background: theme.palette.common.black,
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.body1.fontWeight,
      padding: theme.spacing(1, 1.5),
      position: 'relative',

      // TODO: remove all arrow related styles (from here to end of this rule)
      //  when upgraded to [4.7.0](https://github.com/mui-org/material-ui/blob/master/CHANGELOG.md#470)
      //  or above that has built-in support for arrows. we can enable arrows
      //  for all tooltip by default with a default prop in theme definition
      //  like what we did for disabling ink ripple for buttons globally
      '&::before': {
        content: '""',
        position: 'absolute'
      },
      // selector for top/bottom positioned tooltips is changed because of
      // this issue: https://github.com/mui-org/material-ui/issues/17424
      '[x-placement=bottom] > &::before': {
        top: -8,
        left: '50%',
        transform: 'translateX(-50%)',
        ...cssTriangle.generate({
          ...{
            width: 16,
            height: 8,
            color: theme.palette.common.black
          },
          direction: 'top'
        })
      },
      '[x-placement=top] > &::before': {
        bottom: -8,
        left: '50%',
        transform: 'translateX(-50%)',
        ...cssTriangle.generate({
          ...{
            width: 16,
            height: 8,
            color: theme.palette.common.black
          },
          direction: 'bottom'
        })
      },
      '&.MuiTooltip-tooltipPlacementLeft::before': {
        right: -8,
        top: '50%',
        transform: 'translateY(-50%)',
        ...cssTriangle.generate({
          ...{
            width: 8,
            height: 16,
            color: theme.palette.common.black
          },
          direction: 'right'
        })
      },
      '&.MuiTooltip-tooltipPlacementRight::before': {
        left: -8,
        top: '50%',
        transform: 'translateY(-50%)',
        ...cssTriangle.generate({
          ...{
            width: 8,
            height: 16,
            color: theme.palette.common.black
          },
          direction: 'left'
        })
      }
    },
    '.MuiButton-outlined:not(.MuiButton-outlinedPrimary, .MuiButton-outlinedSecondary)': {
      borderColor: theme.palette.common.black
    }
  }
}))(() => null)
