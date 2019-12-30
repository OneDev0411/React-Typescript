import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@material-ui/core'
import { addNotification } from 'reapop'
import pluralize from 'pluralize'

import { getContactDuplicateContacts } from 'models/contacts/get-contact-duplicate-contacts'
import { mergeContact } from 'models/contacts/merge-contact'

import { Callout } from 'components/Callout'
import DuplicateContactsDrawer from 'components/DuplicateContacts/DuplicateContactsDrawer'

import { CallOutContentContainer } from './styled'

interface Props {
  contact: IContact
  mergeCallback: (contactId: UUID) => Promise<void>
}

export default function MergeDuplicates({ contact, mergeCallback }: Props) {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(true)
  const [masterId, setMasterId] = useState(contact.id)
  const [isContactsListDrawerOpen, setIsContactsListDrawerOpen] = useState(
    false
  )
  const [duplicateContacts, setDuplicateContacts] = useState<IContact[]>([])

  const fetchDuplicates = useCallback(async () => {
    const duplicates = await getContactDuplicateContacts(contact.id)

    setDuplicateContacts(duplicates.contacts)
  }, [contact.id])

  useEffect(() => {
    fetchDuplicates()
  }, [contact.id, fetchDuplicates])

  const handleReviewClick = () => {
    setIsContactsListDrawerOpen(true)
  }

  const handleCloseDrawerClick = () => {
    setIsContactsListDrawerOpen(false)
  }

  const handleDismissClick = (contactId: UUID) => {
    setDuplicateContacts(
      duplicateContacts.filter(item => item.id !== contactId)
    )
  }

  const handleSetMasterClick = (contactId: UUID) => {
    setMasterId(contactId)
  }

  const handleMergeClick = async () => {
    try {
      await mergeContact(masterId, duplicateContacts.map(item => item.id))
      dispatch(
        addNotification({
          status: 'success',
          message: `${duplicateContacts.length} contacts merged successfully.`
        })
      )
      setIsContactsListDrawerOpen(false)
      await mergeCallback(masterId)

      // Refetch the duplicates if we are in the master contact page
      if (masterId === contact.id) {
        fetchDuplicates()
      }
    } catch (err) {
      dispatch(
        addNotification({
          status: 'error',
          message:
            'Something went wrong while merging the contacts. Please try again.'
        })
      )
      console.error(err)
    }
  }

  if (duplicateContacts.length === 0 || !isOpen) {
    return null
  }

  return (
    <>
      <Callout
        dense
        type="warn"
        closeButtonTooltip="Dismiss"
        style={{ padding: '0.5rem 1rem', margin: '1rem' }}
        onClose={() => setIsOpen(false)}
      >
        <CallOutContentContainer>
          <span>
            We’ve found {duplicateContacts.length - 1} other{' '}
            {pluralize('contact', duplicateContacts.length - 1)} similar to{' '}
            <b>{contact.display_name}</b>. Do you want to merge them?
          </span>
          <Button color="primary" variant="text" onClick={handleReviewClick}>
            Review
          </Button>
        </CallOutContentContainer>
      </Callout>

      {isContactsListDrawerOpen && (
        <DuplicateContactsDrawer
          title="Merge Contacts"
          contacts={duplicateContacts}
          masterId={masterId}
          onDismissClick={handleDismissClick}
          onSetMasterClick={handleSetMasterClick}
          onMergeClick={handleMergeClick}
          onClose={handleCloseDrawerClick}
        />
      )}
    </>
  )
}
