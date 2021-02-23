import React from 'react'
import { Box, Typography, makeStyles, Theme } from '@material-ui/core'

import {
  mdiCalendarMonthOutline,
  mdiNewspaperVariantOutline,
  mdiScriptTextOutline
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      padding: theme.spacing(3, 5),
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center'
    },
    title: {
      marginBottom: theme.spacing(2)
    },
    buttonContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    },
    button: {
      padding: theme.spacing(2),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      textAlign: 'left',
      cursor: 'pointer',
      flexGrow: 1,
      '&:hover': {
        background: theme.palette.action.hover
      }
    },
    buttonIcon: {
      display: 'block',
      color: theme.palette.secondary.main
    },
    buttonTitle: {
      display: 'block',
      marginTop: theme.spacing(0.5)
    }
  }),
  { name: 'AddStepButtons' }
)

interface Props {
  onNewEventClick: () => any
  onNewMarketingEmailClick: () => any
  onNewBasicEmailClick: () => any
}

export const AddButtons = ({
  onNewEventClick,
  onNewMarketingEmailClick,
  onNewBasicEmailClick
}: Props) => {
  const classes = useStyles()

  return (
    <Box className={classes.container} position="relative">
      <Typography variant="body1" className={classes.title}>
        Add a New Step
      </Typography>
      <Box className={classes.buttonContainer}>
        <Box className={classes.button} onClick={onNewEventClick}>
          <SvgIcon
            path={mdiCalendarMonthOutline}
            className={classes.buttonIcon}
          />
          <Typography
            variant="button"
            color="secondary"
            className={classes.buttonTitle}
          >
            Add a reminder
          </Typography>
          <Typography variant="body2" color="textSecondary">
            for call, meet, follow up ...
          </Typography>
        </Box>
        <Box
          mx={1}
          className={classes.button}
          onClick={onNewMarketingEmailClick}
        >
          <SvgIcon
            path={mdiNewspaperVariantOutline}
            className={classes.buttonIcon}
          />
          <Typography
            variant="button"
            color="secondary"
            className={classes.buttonTitle}
          >
            Automated Marketing Email
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Using Marketing templates
          </Typography>
        </Box>
        <Box className={classes.button} onClick={onNewBasicEmailClick}>
          <SvgIcon path={mdiScriptTextOutline} className={classes.buttonIcon} />
          <Typography
            variant="button"
            color="secondary"
            className={classes.buttonTitle}
          >
            Automated Simple Email
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Using simple templates
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
