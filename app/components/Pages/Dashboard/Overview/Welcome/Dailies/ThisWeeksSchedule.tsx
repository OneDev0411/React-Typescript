import { useEffect, useState } from 'react'

import { Box, Button, List, Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { browserHistory } from 'react-router'

import { getOAuthAccounts } from '@app/models/o-auth-accounts/get-o-auth-accounts'
import { AnimatedLoader } from 'components/AnimatedLoader'
import CalendarEventListItem from 'components/CalendarEvent/ListItem'
import { InlineBadge } from 'components/InlineBadge'
import { addNotification as notify } from 'components/notification'
import GoogleIcon from 'components/SvgIcons/Google/IconGoogle'
import { iconSizes } from 'components/SvgIcons/icon-sizes'
import OutlookIcon from 'components/SvgIcons/Outlook/IconOutlook'
import { OAuthProvider } from 'constants/contacts'
import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

import { EmptyState } from '../../components/EmptyState'

const NUMBER_OF_EVENTS_TO_SHOW = 50

const useStyles = makeStyles(
  (theme: Theme) => ({
    boxWrapper: {
      flex: 1
    },
    boxTitle: {
      alignItems: 'flex-start',
      display: 'flex',
      marginBottom: theme.spacing(1.5)
    },
    boxContainer: {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: theme.shape.borderRadius,
      height: '300px',
      padding: theme.spacing(1),
      overflowY: 'scroll'
    },
    boxFooter: {
      marginTop: theme.spacing(1),
      textAlign: 'right'
    },
    listIcon: { marginRight: theme.spacing(2) }
  }),
  { name: 'ThisWeeksSchedule' }
)

interface Props {
  isLoading: boolean
  events: ICalendarEvent[]
}

export function ThisWeeksSchedule({ isLoading, events }: Props) {
  const dispatch = useDispatch()
  const [gmailOrOutlookLoading, setGmailOrOutlookLoading] = useState(true)
  const [gmailOrOutlookSynced, setGmailOrOutlookSynced] = useState(false)

  useEffect(() => {
    async function checkOAuthAccounts() {
      const google = await getOAuthAccounts(OAuthProvider.Google)
      const outlook = await getOAuthAccounts(OAuthProvider.Outlook)

      setGmailOrOutlookSynced(Boolean(google.length || outlook.length))

      setGmailOrOutlookLoading(false)
    }

    checkOAuthAccounts()
  }, [])

  const classes = useStyles()

  const celebrationsEventTypes = [
    'wedding_anniversary',
    'birthday',
    'child_birthday',
    'work_anniversary',
    'home_anniversary'
  ]

  // We just need to show events not in the list above
  const filteredEvents = events.filter(
    event => !celebrationsEventTypes.includes(event.event_type)
  )

  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  const handleGoogleConnect = () => {
    if (google.connecting) {
      return dispatch(
        notify({
          message: `a sync process has already been requested,
 please wait till getting finishes.`,
          status: 'info'
        })
      )
    }

    google.connect()
  }

  return (
    <Box className={classes.boxWrapper}>
      <Typography variant="h6" className={classes.boxTitle}>
        <InlineBadge badgeContent={filteredEvents.length} color="primary">
          To Do
        </InlineBadge>
      </Typography>
      <Box className={classes.boxContainer}>
        {(isLoading || gmailOrOutlookLoading) && (
          <>
            <AnimatedLoader />
          </>
        )}
        {!isLoading &&
        !gmailOrOutlookLoading &&
        gmailOrOutlookSynced &&
        filteredEvents.length === 0 ? (
          <EmptyState
            description="You're all caught up!"
            iconSrc="/static/icons/empty-states/letter.svg"
          />
        ) : null}
        {!isLoading &&
          !gmailOrOutlookLoading &&
          !gmailOrOutlookSynced &&
          filteredEvents.length === 0 && (
            <EmptyState
              description="By connecting one or more of your accounts you’ll have your contacts, email and calendar all synced, both ways. Learn more."
              iconSrc="/static/icons/empty-states/letter.svg"
              title="Connect Your Google / Outlook"
            >
              <Box pt={3} display="flex" flexWrap="wrap">
                <Box mr={1} mb={1}>
                  <Button
                    variant="outlined"
                    disabled={google.connecting}
                    onClick={() => {
                      handleGoogleConnect()
                    }}
                  >
                    <GoogleIcon
                      size={iconSizes.medium}
                      className={classes.listIcon}
                    />
                    Connect Your Google
                  </Button>
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    disabled={outlook.connecting}
                    onClick={() => {
                      outlook.connect()
                    }}
                  >
                    <OutlookIcon
                      size={iconSizes.medium}
                      className={classes.listIcon}
                    />
                    Connect Your Outlook
                  </Button>
                </Box>
              </Box>
            </EmptyState>
          )}
        {!isLoading && (
          <List>
            {filteredEvents.slice(0, NUMBER_OF_EVENTS_TO_SHOW).map(event => (
              <CalendarEventListItem event={event} key={event.id} />
            ))}
          </List>
        )}
      </Box>
      <Box className={classes.boxFooter}>
        <Button
          variant="text"
          color="primary"
          onClick={() => browserHistory.push('/dashboard/calendar')}
        >
          View Calendar
        </Button>
      </Box>
    </Box>
  )
}

export default ThisWeeksSchedule
