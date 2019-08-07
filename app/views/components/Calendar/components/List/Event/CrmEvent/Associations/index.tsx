import React, { MouseEvent } from 'react'

import styles from './styles'

interface Props {
  event: ICalendarEvent
  onClickAssociation(e: MouseEvent<HTMLElement>): void
}

export function Associations(props: Props) {
  const associations = props.event.full_crm_task!.associations

  const contacts = (associations || []).filter(
    association => association.association_type === 'contact'
  )

  if (contacts.length === 0) {
    return (
      <span style={styles.association} onClick={props.onClickAssociation}>
        no body
      </span>
    )
  }

  const users = new Array(Math.min(2, contacts.length))
    .fill(null)
    .map((_, index) => [
      <a
        key={`assoc${index}`}
        onClick={e => e.stopPropagation()}
        target="_blank"
        href={`/dashboard/contacts/${contacts[index].contact!.id}`}
      >
        {contacts[index].contact!.display_name}
      </a>,
      contacts.length > 1 && index === 0 && <span key={`sepr${index}`}>, </span>
    ])

  return (
    <>
      {contacts.length <= 2
        ? users
        : [
            ...users,
            <>
              {' and '}
              <span
                style={styles.association}
                onClick={props.onClickAssociation}
              >
                {contacts.length - 2} other{contacts.length - 2 > 1 ? 's' : ''}
              </span>
            </>
          ]}
    </>
  )
}
