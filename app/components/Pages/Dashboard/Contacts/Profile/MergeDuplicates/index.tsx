import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { addNotification } from 'reapop'
import pluralize from 'pluralize'

import { getContactDuplicateContacts } from 'models/contacts/get-contact-duplicate-contacts'
import { mergeContact } from 'models/contacts/merge-contact'
import { DuplicateContacts } from 'models/contacts/get-contact-duplicate-contacts/types'
import { dismissMergeContact } from 'models/contacts/dismiss-merge-contact'

import { Callout } from 'components/Callout'
import DuplicateContactsDrawer from 'components/DuplicateContacts/DuplicateContactsDrawer'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { CallOutContentContainer } from './styled'

interface Props {
  contact: IContact
  mergeCallback: (contactId: UUID) => Promise<void>
}

export default function MergeDuplicates({ contact, mergeCallback }: Props) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const confirmation = useContext(ConfirmationModalContext)
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
    setIsContactsListDrawerOpen(false)
  }

  const handleDismissClick = async (
    contactId: UUID,
    checkMinumumDuplicatesCount = true,
    closeOnDismiss = false
  ) => {
    if (!duplicateContacts) {
      return
    }

    // Minimum number of contacts to merge is 2
    if (
      checkMinumumDuplicatesCount &&
      duplicateContacts.contacts.length === 2
    ) {
      dispatch(
        addNotification({
          status: 'warning',
          message: 'You need to have at least 2 contacts to merge.'
        })
      )

      return
    }

    confirmation.setConfirmationModal({
      message: 'Are you sure about dismissing this contact?',
      onConfirm: async () => {
        try {
          await dismissMergeContact(duplicateContacts.id, contactId)

          setDuplicateContacts({
            ...duplicateContacts,
            contacts: duplicateContacts.contacts.filter(
              item => item.id !== contactId
            )
          })

          if (closeOnDismiss) {
            setIsOpen(false)
          }
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
    })
  }

  const handleDismissMergeCallout = async (contactId: UUID) => {
    await handleDismissClick(contactId, false, true)
  }

  const handleSetMasterClick = (contactId: UUID) => {
    setMasterId(contactId)
  }

  const handleMergeClick = async () => {
    if (!duplicateContacts) {
      return
    }

    confirmation.setConfirmationModal({
      message: 'Are you sure about merging this duplicate contacts list?',
      onConfirm: async () => {
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
    })
  }

  if (!duplicateContacts || !isOpen) {
    return null
  }

  return (
    <>
      <Callout
        dense
        type="info"
        closeButtonTooltip="Dismiss"
        style={{ padding: '0.5rem 1rem', margin: '1rem' }}
        onClose={() => {
          handleDismissMergeCallout(contact.id)
        }}
      >
        <CallOutContentContainer>
          <span style={{ color: theme.palette.warning.contrastText }}>
            We’ve found {duplicateContacts.contacts.length - 1} other{' '}
            {pluralize('contact', duplicateContacts.contacts.length - 1)}{' '}
            similar to <b>{contact.display_name}</b>. Do you want to merge them?
          </span>
          <Button color="secondary" variant="text" onClick={handleReviewClick}>
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
