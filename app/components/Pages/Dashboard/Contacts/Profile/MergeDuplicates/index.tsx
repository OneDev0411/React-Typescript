import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@material-ui/core'
import { addNotification } from 'reapop'
import pluralize from 'pluralize'

import { getContactDuplicateContacts } from 'models/contacts/get-contact-duplicate-contacts'
import { mergeContact } from 'models/contacts/merge-contact'
import { DuplicateContacts } from 'models/contacts/get-contact-duplicate-contacts/types'

import { Callout } from 'components/Callout'
import DuplicateContactsDrawer from 'components/DuplicateContacts/DuplicateContactsDrawer'

import { dismissMergeCluster } from 'models/contacts/dismiss-merge-cluster'

import { dismissMergeContact } from 'models/contacts/dismiss-merge-contact'

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
  const [
    duplicateContacts,
    setDuplicateContacts
  ] = useState<DuplicateContacts | null>(null)

  const fetchDuplicates = useCallback(async () => {
    try {
      const response = await getContactDuplicateContacts(contact.id)

      setDuplicateContacts(response.data)
    } catch (err) {
      if (err.status === 404) {
        setDuplicateContacts(null)
      }
    }
  }, [contact.id])

  useEffect(() => {
    fetchDuplicates()
  }, [contact.id, fetchDuplicates])

  const handleReviewClick = () => {
    setIsContactsListDrawerOpen(true)
  }

  const handleCloseDrawerClick = async () => {
    if (!duplicateContacts) {
      return
    }

    try {
      await dismissMergeCluster(duplicateContacts.id)
      setIsContactsListDrawerOpen(false)
    } catch (err) {
      dispatch(
        addNotification({
          status: 'error',
          message:
            'Something went wrong while dismissing merge duplicate contacts. Please try again.'
        })
      )
      console.error(err)
    }
  }

  const handleDismissClick = async (contactId: UUID) => {
    if (!duplicateContacts) {
      return
    }

    // Minimum number of contacts to merge is 2
    if (duplicateContacts.contacts.length === 2) {
      dispatch(
        addNotification({
          status: 'warning',
          message: 'You need to have at least 2 contacts to merge.'
        })
      )

      return
    }

    try {
      await dismissMergeContact(duplicateContacts.id, contactId)

      setDuplicateContacts({
        ...duplicateContacts,
        contacts: duplicateContacts.contacts.filter(
          item => item.id !== contactId
        )
      })
    } catch (err) {
      dispatch(
        addNotification({
          status: 'error',
          message:
            'Something went wrong while dismissing the contact. Please try again.'
        })
      )
      console.error(err)
    }
  }

  const handleSetMasterClick = (contactId: UUID) => {
    setMasterId(contactId)
  }

  const handleMergeClick = async () => {
    if (!duplicateContacts) {
      return
    }

    try {
      await mergeContact(
        masterId,
        duplicateContacts.contacts.map(item => item.id)
      )
      dispatch(
        addNotification({
          status: 'success',
          message: `${
            duplicateContacts.contacts.length
          } contacts merged successfully.`
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

  if (!duplicateContacts || !isOpen) {
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
            We’ve found {duplicateContacts.contacts.length - 1} other{' '}
            {pluralize('contact', duplicateContacts.contacts.length - 1)}{' '}
            similar to <b>{contact.display_name}</b>. Do you want to merge them?
          </span>
          <Button color="primary" variant="text" onClick={handleReviewClick}>
            Review
          </Button>
        </CallOutContentContainer>
      </Callout>

      {isContactsListDrawerOpen && (
        <DuplicateContactsDrawer
          title="Merge Contacts"
          contacts={duplicateContacts.contacts}
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
