import React, { memo } from 'react'

import { EventIcon } from '../EventIcon'

import { ContainerStyle, TitleStyle, SubTitleStyle } from '../styles'
import { AssociationStyle } from './styles'

interface StateProps {
  user: IUser
}

interface Props {
  user?: IUser
  event: ICalendarEvent
  onClickCrmEventAssociations(event: ICalendarEvent): void
}

const CrmEvent = memo((props: Props) => {
  const handleSelectEvent = () => props.onClickCrmEventAssociations(props.event)

  /**
   * returns list of associations with this format:
   * assoc1, assoc2 <and (assocLength - 2) others>
   */
  const associationsList = () => {
    const associations = props.event.full_crm_task!.associations

    const contacts = (associations || []).filter(
      association => association.association_type === 'contact'
    )

    if (contacts.length === 0) {
      return (
        <span style={AssociationStyle} onClick={handleSelectEvent}>
          no body
        </span>
      )
    }

    const users = new Array(Math.min(2, contacts.length))
      .fill(null)
      .map((_, index) => [
        <span
          key={`Association_${index}`}
          style={AssociationStyle}
          onClick={handleSelectEvent}
        >
          {contacts[index].contact!.display_name}
        </span>,
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
            <span style={AssociationStyle} onClick={handleSelectEvent}>
              {contacts.length - 2} other{contacts.length - 2 > 1 ? 's' : ''}
            </span>
          </>
        ]
  }

  return (
    <div>
      <div style={ContainerStyle}>
        <EventIcon event={props.event} />

        <div style={TitleStyle}>
          {props.event.event_type}{' '}
          {getCrmEventTypePreposition(props.event.event_type)}{' '}
          {associationsList()}
        </div>
      </div>

      {props.event.event_type === 'Email' && (
        <div style={SubTitleStyle}>{props.event.title}</div>
      )}
    </div>
  )
})

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

export default CrmEvent
