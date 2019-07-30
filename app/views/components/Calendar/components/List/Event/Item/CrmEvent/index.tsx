import React, { useState } from 'react'
import { connect } from 'react-redux'

import { IAppState } from 'reducers'

import { CrmEvents } from '../../../../CrmEvents'

import { Title } from '../styled'
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

  const assignees = () => {
    const list: IUser[] = props.event.full_crm_task!.assignees

    const users = new Array(Math.min(2, list.length))
      .fill(null)
      .map((_, index) => [
        <Assignee key={index} onClick={() => setShowEventsDrawer(true)}>
          {list[index].display_name}
        </Assignee>,
        list.length > 1 && index === 0 && <span>, </span>
      ])

    return list.length <= 2
      ? users
      : [
          ...users,
          <>
            {' '}
            and{' '}
            <Assignee onClick={() => setShowEventsDrawer(true)}>
              {list.length - 2} other{list.length - 2 > 1 ? 's' : ''}
            </Assignee>
          </>
        ]
  }

  return (
    <>
      <Title>
        {props.event.event_type}{' '}
        {getCrmEventTypePreposition(props.event.event_type)} {assignees()}
      </Title>

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
