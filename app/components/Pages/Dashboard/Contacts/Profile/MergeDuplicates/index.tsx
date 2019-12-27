import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'

import { getContactDuplicateContacts } from 'models/contacts/get-contact-duplicate-contacts'

import { Callout } from 'components/Callout'

import { CallOutContentContainer } from './styled'

interface Props {
  contact: IContact
}

export default function MergeDuplicates({ contact }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [duplicateContacts, setDuplicateContacts] = useState<IContact[]>([])

  useEffect(() => {
    async function fetchDuplicates() {
      const duplicates = await getContactDuplicateContacts(contact.id)

      setDuplicateContacts(duplicates.contacts)
    }

    fetchDuplicates()
  }, [contact.id])

  if (duplicateContacts.length === 0 || !isOpen) {
    return null
  }

  const handleReviewClick = () => {
    console.log('Review Clicked')
  }

  return (
    <Callout
      dense
      type="warn"
      closeButtonTooltip="Dismiss"
      style={{ padding: '0.5rem 1rem', margin: '1rem' }}
      onClose={() => setIsOpen(false)}
    >
      <CallOutContentContainer>
        <span>
          We’ve found {duplicateContacts.length} other contacts similar to{' '}
          <b>{contact.display_name}</b>. Do you want to merge them?
        </span>
        <Button color="primary" variant="text" onClick={handleReviewClick}>
          Review
        </Button>
      </CallOutContentContainer>
    </Callout>
  )
}
