import { Accordion, withStyles, Theme } from '@material-ui/core'

export const MenuAccordion = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: 'transparent',

    '&.Mui-expanded': {
      margin: 0
    }
  }
}))(Accordion)
