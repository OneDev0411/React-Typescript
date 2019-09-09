import React, { useContext, useRef } from 'react'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import { ListContext } from '../context'

interface BirthdayRef {
  showBuilder(contact: IContact, contactId?: UUID): void
}

interface Props {}

export function ActionController(props: Props) {
  const { actions } = useContext(ListContext)
  const birthdayCardRef = useRef<BirthdayRef>(null)

  useEffectOnce(() => {
    actions.on('event-action', ({ event }: { event: ICalendarEvent }) => {
      if (event.event_type === 'birthday') {
        birthdayCardRef.current!.showBuilder(event.full_contact as IContact)
      }
    })

    return () => {
      actions.removeEventListener('event-action')
    }
  })

  return (
    <>
      <SendContactCard ref={birthdayCardRef} />
    </>
  )
}
