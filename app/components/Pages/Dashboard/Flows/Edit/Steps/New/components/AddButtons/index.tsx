import { Box, Typography, makeStyles, Theme } from '@material-ui/core'
import {
  mdiCalendarMonthOutline,
  mdiNewspaperVariantOutline,
  mdiScriptTextOutline
} from '@mdi/js'
import cn from 'classnames'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import type { Forms } from '../..'

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
      justifyContent: 'space-between',
      [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap'
      }
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
      },
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        padding: theme.spacing(1.5),
        marginRight: 0,
        marginLeft: 0,
        '&:not(:last-child)': {
          marginBottom: theme.spacing(2)
        }
      }
    },
    buttonIcon: {
      display: 'block',
      color: theme.palette.secondary.main
    },
    buttonTitle: {
      display: 'block',
      marginTop: theme.spacing(0.5)
    },
    isActive: {
      background: theme.palette.action.hover
    }
  }),
  { name: 'AddStepButtons' }
)

interface Props {
  activeForm: Forms
  onNewEventClick: () => any
  onNewMarketingEmailClick: () => any
  onNewBasicEmailClick: () => any
}

export const AddButtons = ({
  activeForm,
  onNewEventClick,
  onNewMarketingEmailClick,
  onNewBasicEmailClick
}: Props) => {
  const classes = useStyles()

  return (
    <Box className={classes.container} position="relative">
      <Typography variant="body1" className={classes.title}>
        Select a Step
      </Typography>
      <Box className={classes.buttonContainer}>
        <Box
          className={cn(classes.button, {
            [classes.isActive]: activeForm === 'event'
          })}
          onClick={onNewEventClick}
        >
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
          className={cn(classes.button, {
            [classes.isActive]: activeForm === 'marketing_email'
          })}
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
        <Box
          className={cn(classes.button, {
            [classes.isActive]: activeForm === 'basic_email'
          })}
          onClick={onNewBasicEmailClick}
        >
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
