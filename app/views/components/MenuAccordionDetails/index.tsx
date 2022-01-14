import { AccordionDetails, withStyles, Theme } from '@material-ui/core'

export const MenuAccordionDetails = withStyles((theme: Theme) => ({
  root: {
    padding: 0,
    flexDirection: 'column'
  }
}))(AccordionDetails)
