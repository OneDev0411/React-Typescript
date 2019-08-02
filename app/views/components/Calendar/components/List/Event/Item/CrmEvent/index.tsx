import React, { useState } from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { IAppState } from 'reducers'

import { EventIcon } from '../Icon'

import { CrmEvents } from '../../../../CrmEvents'

import { Title, SubTitle } from '../styled'
import { Association } from './styled'

interface StateProps {
  user: IUser
}

interface Props {
  user?: IUser
  onCrmEventChange: (event: IEvent, type: string) => void
  event: CalendarEvent
}

export function CrmEvent(props: Props) {
  const [showEventDrawer, setShowEventDrawer] = useState(false)

  const handleEventChange = (event: IEvent, type: string) => {
    setShowEventDrawer(false)

    props.onCrmEventChange(event, type)
  }

  const handleShowEventDrawer = () => setShowEventDrawer(true)

  const associationsList = () => {
    const associations = props.event.full_crm_task!.associations

    const contacts = (associations || []).filter(
      association => association.association_type === 'contact'
    )

    if (contacts.length === 0) {
      return <Association onClick={handleShowEventDrawer}>no body</Association>
    }

    const users = new Array(Math.min(2, contacts.length))
      .fill(null)
      .map((_, index) => [
        <Association
          key={`Association_${index}`}
          onClick={handleShowEventDrawer}
        >
          {contacts[index].contact!.display_name}
        </Association>,
        contacts.length > 1 && index === 0 && (
          <span key={`Separator_${index}`}>, </span>
        )
      ])

    return contacts.length <= 2
      ? users
      : [
          ...users,
          <>
            {' '}
            and{' '}
            <Association onClick={handleShowEventDrawer}>
              {contacts.length - 2} other{contacts.length - 2 > 1 ? 's' : ''}
            </Association>
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

      {showEventDrawer && (
        <CrmEvents
          isOpenEventDrawer
          event={props.event}
          user={props.user as IUser}
          onEventChange={handleEventChange}
          onCloseEventDrawer={() => setShowEventDrawer(false)}
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
