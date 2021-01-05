import React from 'react'

import { Box, FormControlLabel, Checkbox } from '@material-ui/core'
import { withStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Greeting from './Greeting'
import HappyPaths from './HappyPaths'

// Customizing MUI accordion styles
const Accordion = withStyles((theme: Theme) => ({
  root: {
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'none'
  }
}))(MuiAccordion)

// Customizing MUI accordion summary styles
const AccordionSummary = withStyles((theme: Theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`
  },
  content: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  expanded: {
    // margin: `${theme.spacing(1)}px 0`
  }
}))(MuiAccordionSummary)

// Customizing MUI accordion summary styles
const AccordionDetails = withStyles((theme: Theme) => ({
  root: {
    padding: 0
  }
}))(MuiAccordionDetails)

const useStyles = makeStyles(
  (theme: Theme) => ({
    main: {
      display: 'flex',
      width: '100%',
      height: '400px'
    },
    body: {
      flexBasis: '70%',
      padding: theme.spacing(4)
    },
    sidebar: {
      background: theme.palette.grey[100],
      borderLeft: `1px solid ${theme.palette.grey[300]}`,
      flexBasis: '30%'
    }
  }),
  { name: 'WelcomeBox' }
)

function OverviewDashboard() {
  const classes = useStyles()

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="welcome-content"
        id="welcome-header"
      >
        <FormControlLabel
          aria-label="collapse"
          onClick={event => event.stopPropagation()}
          onFocus={event => event.stopPropagation()}
          control={<Checkbox />}
          label="Keep this collapsed"
        />
      </AccordionSummary>
      <AccordionDetails>
        <Box className={classes.main}>
          <Box className={classes.body}>
            <Greeting />
          </Box>
          <Box className={classes.sidebar}>
            <HappyPaths />
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default OverviewDashboard
