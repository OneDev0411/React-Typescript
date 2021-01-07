import React, { useState } from 'react'

import { Box, Typography } from '@material-ui/core'
import { withStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Greeting from './Greetings'
import HappyPaths from './HappyPaths'
import ProgressBar from '../components/ProgressBar'

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
      height: '60vh'
    },
    body: {
      height: '100%',
      flexFlow: 'column',
      display: 'flex'
    },
    content: {
      padding: theme.spacing(4),
      flex: '1 1 auto'
    },
    banners: {
      flex: '0 1 auto',
      display: 'flex'
    },
    banner: {
      flexGrow: 1
    },
    sidebar: {
      background: theme.palette.grey[100],
      borderLeft: `1px solid ${theme.palette.grey[300]}`,
      flexBasis: '50%',
      overflow: 'scroll'
    }
  }),
  { name: 'WelcomeBox' }
)

function OverviewDashboard() {
  const classes = useStyles()
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true)

  return (
    <Accordion expanded={accordionExpanded}>
      <AccordionSummary
        onClick={() => setAccordionExpanded(!accordionExpanded)}
        expandIcon={<ExpandMoreIcon />}
        aria-controls="welcome-content"
        id="welcome-header"
      >
        {!accordionExpanded && (
          <Box display="flex" flexGrow={1}>
            <Box mx={2}>
              <Typography>Your onboarding progress:</Typography>
            </Box>
            <Box width={300} display="flex" alignItems="center" flexGrow={1}>
              <ProgressBar value={14} determinate />
            </Box>
          </Box>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Box className={classes.main}>
          <Box className={classes.body}>
            <Box className={classes.content}>
              <Greeting />
            </Box>
            <Box className={classes.banners}>
              <Box className={classes.banner}>
                <img
                  src="/static/images/overview/intro-video.jpg"
                  alt="2 Minute Intro Video"
                  height="200"
                />
              </Box>
              <Box>
                <img
                  src="/static/images/overview/ios-app.jpg"
                  alt="Download iOS App"
                  height="200"
                />
              </Box>
            </Box>
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
