import { AccordionSummary, withStyles, Theme } from '@material-ui/core'

export const MenuAccordionSummary = withStyles((theme: Theme) => ({
  root: {
    padding: 0,
    minHeight: '44px',

    '&.Mui-expanded': {
      minHeight: '44px'
    },

    'svg.MuiSvgIcon-root': {
      color: theme.palette.common.white,
      position: 'relative',
      top: '-2px'
    }
  },
  content: {
    display: 'flex',
    justifyContent: 'flex-start',
    margin: 0,

    '& a': {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between'
    },

    '&.Mui-expanded': {
      margin: '6px 0 ',

      ' & div': {
        '& svg': {
          color: theme.palette.primary.light
        }
      }
    }
  }
}))(AccordionSummary)
