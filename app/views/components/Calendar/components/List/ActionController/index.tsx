import React, { useContext, useRef, useState } from 'react'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import { EmailThreadModal } from 'components/EmailThreadModal'

import { ListContext } from '../context'

interface BirthdayRef {
  showBuilder(contact: IContact, contactId?: UUID): void
}

export function ActionController() {
  const { actions } = useContext(ListContext)
  const birthdayCardRef = useRef<BirthdayRef>(null)
  const [emailThreadKey, setEmailThreadKey] = useState<string | null>(null)

  useEffectOnce(() => {
    const handler = ({ event }: { event: ICalendarEvent }) => {
      if (event.event_type === 'birthday') {
        birthdayCardRef.current!.showBuilder(event.full_contact as IContact)
      }

      if (event.event_type === 'outlook' && event.thread) {
        setEmailThreadKey(event.thread)
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
      <EmailThreadModal
        open={!!emailThreadKey}
        onClose={() => setEmailThreadKey(null)}
        threadKey={emailThreadKey}
      />
    </>
  )
}
