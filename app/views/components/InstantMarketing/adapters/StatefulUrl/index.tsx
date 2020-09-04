import React, { useState, useEffect, useCallback } from 'react'
import { withRouter, WithRouterProps } from 'react-router'
import { addNotification as notify } from 'reapop'
import { useDispatch } from 'react-redux'

import { goTo } from 'utils/go-to'

import { getContact } from 'models/contacts/get-contact'
import getListing from 'models/listings/listing/get-listing'

import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'

function StatefulUrlAdapter({ location }: WithRouterProps) {
  const [listing, setListing] = useState<Nullable<IListing>>(null)
  const [contact, setContact] = useState<Nullable<IContact>>(null)
  const dispatch = useDispatch()

  const notifyError = useCallback(
    (entity: string, statusCode?: number) => {
      dispatch(
        notify({
          status: 'error',
          message:
            statusCode === 404
              ? `${entity} not found.`
              : 'Something went wrong. Please try again or contact support.'
        })
      )
    },
    [dispatch]
  )

  const goToMarketing = () => {
    goTo('/dashboard/marketing')
  }

  useEffect(() => {
    async function fetchContact() {
      const contactId: UUID | undefined = location.query.contactId

      if (!contactId) {
        setContact(null)

        return
      }

      try {
        const response = await getContact(contactId)

        setContact(response.data)
      } catch (err) {
        notifyError('Contact', err.response.statusCode)
        goToMarketing()
      }
    }
    fetchContact()
  }, [location.query.contactId, notifyError])

  useEffect(() => {
    async function fetchListing() {
      const listingId: UUID | undefined = location.query.listingId

      if (!listingId) {
        setListing(null)

        return
      }

      try {
        const fetchedListing = await getListing(listingId)

        setListing(fetchedListing)
      } catch (err) {
        notifyError('Listing', err.response.statusCode)
        goToMarketing()
      }
    }

    fetchListing()
  }, [location.query.listingId, notifyError])

  if (listing) {
    return (
      <ListingFlow
        isTemplatesColumnHiddenDefault={false}
        handleTrigger={goToMarketing}
        isTriggered
        hasExternalTrigger
        listing={listing}
        mediums={location.query.medium}
        types={location.query.templateType.split(',')}
      />
    )
  }

  if (contact) {
    return (
      <ContactFlow
        isTemplatesColumnHiddenDefault={false}
        handleTrigger={goToMarketing}
        isBuilderOpen
        hasExternalTrigger
        contact={contact}
        mediums={location.query.medium}
        types={location.query.templateType.split(',')}
      />
    )
  }

  return null
}

export default withRouter(StatefulUrlAdapter)
