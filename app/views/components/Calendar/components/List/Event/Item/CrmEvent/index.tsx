import React, { useState } from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { IAppState } from 'reducers'

import { EventIcon } from '../Icon'

import { CrmEvents } from '../../../../CrmEvents'

import { Title, SubTitle } from '../styled'
import { Assignee } from './styled'

interface StateProps {
  user: IUser
}

interface Props {
  user?: IUser
  event: CalendarEvent
}

export function CrmEvent(props: Props) {
  const [showEventsDrawer, setShowEventsDrawer] = useState(false)

  const associationsList = () => {
    const associations = props.event.full_crm_task!.associations

    const contacts = (associations || []).filter(
      association => association.association_type === 'contact'
    )

    if (contacts.length === 0) {
      return 'no body'
    }

    const users = new Array(Math.min(2, contacts.length))
      .fill(null)
      .map((_, index) => [
        <Assignee key={index} onClick={() => setShowEventsDrawer(true)}>
          {contacts[index].contact!.display_name}
        </Assignee>,
        contacts.length > 1 && index === 0 && <span>, </span>
      ])

    return contacts.length <= 2
      ? users
      : [
          ...users,
          <>
            {' '}
            and{' '}
            <Assignee onClick={() => setShowEventsDrawer(true)}>
              {contacts.length - 2} other{contacts.length - 2 > 1 ? 's' : ''}
            </Assignee>
          </>
        ]
  }

  return (
    <>
      <div>
        <Flex alignCenter>
          <EventIcon event={props.event} />

          <Title>
            {props.event.event_type}{' '}
            {getCrmEventTypePreposition(props.event.event_type)}{' '}
            {associationsList()}
          </Title>
        </Flex>

        {props.event.event_type === 'Email' && (
          <SubTitle>{props.event.title}</SubTitle>
        )}
      </div>

      {showEventsDrawer && (
        <CrmEvents
          isOpenEventDrawer
          event={props.event}
          user={props.user as IUser}
          onEventChange={() => {}}
          onCloseEventDrawer={() => setShowEventsDrawer(false)}
        />
      )}
    </>
  )
}

function getCrmEventTypePreposition(eventType: string): string {
  switch (eventType) {
    case 'Chat':
    case 'Call':
    case 'In-Person Meeting':
    case 'Other':
      return 'with'

    case 'Mail':
    case 'Email':
    case 'Text':
      return 'to'

    default:
      return ''
  }
}

function mapStateToProps(state: IAppState) {
  return {
    user: state.user
  }
}

export default connect<StateProps, {}, Props>(mapStateToProps)(CrmEvent)
