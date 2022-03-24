import { useEffect, useState } from 'react'

import { Box, Button, List, Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { mdiArrowRight } from '@mdi/js'
import { browserHistory } from 'react-router'

import { OAuthProvider } from '@app/constants/contacts'
import { getOAuthAccounts } from '@app/models/o-auth-accounts/get-o-auth-accounts'
import { AnimatedLoader } from '@app/views/components/AnimatedLoader'
import CalendarEventListItem from '@app/views/components/CalendarEvent/ListItem'
import { InlineBadge } from '@app/views/components/InlineBadge'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { EmptyState } from '../../components/EmptyState'

import { ThisWeeksScheduleEmptyState } from './ThisWeeksScheduleEmptyState'

const NUMBER_OF_EVENTS_TO_SHOW = 50

const useStyles = makeStyles(
  (theme: Theme) => ({
    boxHeader: {
      alignItems: 'center',
      display: 'flex',
      height: '48px',
      justifyContent: 'space-between'
    },
    boxWrapper: {
      flex: 1,
      marginBottom: theme.spacing(5)
    },
    boxTitle: {
      alignItems: 'flex-start',
      display: 'flex'
    },
    boxContainer: {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: theme.shape.borderRadius,
      height: '300px',
      padding: theme.spacing(1),
      overflowY: 'scroll'
    }
  }),
  { name: 'ThisWeeksSchedule' }
)

interface Props {
  isLoading: boolean
  events: ICalendarEvent[]
}

export function ThisWeeksSchedule({ isLoading, events }: Props) {
  const [isAccountSyncing, setIsAccountSyncing] = useState(true)
  const [hasAccount, setHasAccount] = useState(false)

  useEffect(() => {
    async function checkOAuthAccounts() {
      const google = await getOAuthAccounts(OAuthProvider.Google)
      const outlook = await getOAuthAccounts(OAuthProvider.Outlook)

      setHasAccount(Boolean(google.length || outlook.length))

      setIsAccountSyncing(false)
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

  return (
    <Box className={classes.boxWrapper}>
      <Box className={classes.boxHeader}>
        <Typography variant="h6" className={classes.boxTitle}>
          <InlineBadge badgeContent={filteredEvents.length} color="primary">
            To Do
          </InlineBadge>
        </Typography>
        <Button
          variant="text"
          color="primary"
          endIcon={<SvgIcon path={mdiArrowRight} size={muiIconSizes.small} />}
          onClick={() => browserHistory.push('/dashboard/calendar')}
        >
          Calendar
        </Button>
      </Box>
      <Box className={classes.boxContainer}>
        {(isLoading || isAccountSyncing) && (
          <>
            <AnimatedLoader />
          </>
        )}
        {!isLoading &&
        !isAccountSyncing &&
        hasAccount &&
        filteredEvents.length === 0 ? (
          <EmptyState
            description="You're all caught up!"
            iconSrc="/static/icons/empty-states/letter.svg"
          />
        ) : null}
        {!isLoading &&
          !isAccountSyncing &&
          !hasAccount &&
          filteredEvents.length === 0 && <ThisWeeksScheduleEmptyState />}
        {!isLoading && (
          <List>
            {filteredEvents.slice(0, NUMBER_OF_EVENTS_TO_SHOW).map(event => (
              <CalendarEventListItem event={event} key={event.id} />
            ))}
          </List>
        )}
      </Box>
    </Box>
  )
}

export default ThisWeeksSchedule
