import { AccordionSummary, withStyles, Theme } from '@material-ui/core'

export const MenuAccordionSummary = withStyles((theme: Theme) => ({
  root: {
    padding: 0,
    minHeight: '46px',

    '&.Mui-expanded': {
      minHeight: '46px'
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
      justifyContent: 'space-between',

      '&:active,&:focus': {
        textDecoration: 'none',
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,

        '& svg': {
          color: theme.palette.primary.main
        }
      }
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
