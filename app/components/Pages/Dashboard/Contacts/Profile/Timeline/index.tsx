import React, { useState, useRef } from 'react'

import { Button } from '@material-ui/core'

import List from 'components/Calendar'
import { CalendarRef } from 'components/Calendar/types'

import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'

import { Card } from '../styled'
import { Container, Title } from './styled'

interface Props {
  contactId: UUID
}

export function Timeline(props: Props) {
  const calendarRef = useRef<CalendarRef>(null)
  const [showUpcomingEvents, setShowUpcomingEvents] = useState<boolean>(false)

  const handleOnLoadEvents = () => {}

  const filter = {
    contactId: props.contactId,
    object_types: [
      'crm_association',
      'email_campaign_recipient',
      'contact_notes'
    ]
  }

  const associations = [
    ...CRM_TASKS_QUERY.associations,
    'calendar_event.crm_task',
    'calendar_event.full_campaign',
    'calendar_event.full_crm_task'
  ]

  return (
    <Container>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setShowUpcomingEvents(!showUpcomingEvents)}
      >
        {showUpcomingEvents ? 'Hide' : 'Show'} Upcoming Events
      </Button>

      <div
        style={{
          display: showUpcomingEvents ? 'block' : 'none'
        }}
      >
        <Title>Upcoming Events</Title>

        <Card>
          <List
            filter={filter}
            associations={associations}
            onChangeActiveDate={() => {}}
            onLoadEvents={handleOnLoadEvents}
          />
        </Card>
      </div>

      <Title>Today Events</Title>

      <Card>
        <List
          ref={calendarRef}
          filter={filter}
          associations={associations}
          onChangeActiveDate={() => {}}
          onLoadEvents={handleOnLoadEvents}
        />
      </Card>
    </Container>
  )
}
