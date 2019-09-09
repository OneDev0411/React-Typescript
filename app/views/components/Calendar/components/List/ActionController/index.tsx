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
    const handler = ({ event }: { event: ICalendarEvent }) => {
      if (event.event_type === 'birthday') {
        birthdayCardRef.current!.showBuilder(event.full_contact as IContact)
      }
    }

    actions.on('event-action', handler)

    return () => {
      actions.removeListener('event-action', handler)
    }
  })

  return (
    <>
      <SendContactCard ref={birthdayCardRef} />
    </>
  )
}
