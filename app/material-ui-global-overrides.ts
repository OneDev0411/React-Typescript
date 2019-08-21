import { Theme, withStyles } from '@material-ui/core'
import cssTriangle from 'css-triangle'

export const MaterialUiGlobalOverrides = withStyles((theme: Theme) => ({
  // @global is handled by jss-plugin-global.
  '@global': {
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    '.MuiButtonBase-root': {
      boxShadow: 'none',
      // because of disabling ripple globally
      '&.Mui-focusVisible': {
        background: theme.palette.action.selected
      }
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
    },
    '.MuiOutlinedInput-input[type="time"]': {
      minWidth: '7rem'
    },

    '.MuiTooltip-tooltip': {
      background: theme.palette.common.black,
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.body1.fontWeight,
      padding: theme.spacing(1, 1.5),
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute'
      },
      '&.MuiTooltip-tooltipPlacementBottom::before': {
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
      '&.MuiTooltip-tooltipPlacementTop::before': {
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
    }
  }
}))(() => null)
