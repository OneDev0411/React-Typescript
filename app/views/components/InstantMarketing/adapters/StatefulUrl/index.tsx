import React, { useState, useEffect } from 'react'
import { withRouter, WithRouterProps } from 'react-router'

import { goTo } from 'utils/go-to'

import { getContact } from 'models/contacts/get-contact'
import getListing from 'models/listings/listing/get-listing'

import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'

function StatefulUrlAdapter({ location, ...props }: WithRouterProps) {
  const [listing, setListing] = useState<Nullable<IListing>>(null)
  const [contact, setContact] = useState<Nullable<IContact>>(null)

  useEffect(() => {
    async function fetchContact() {
      const contactId: UUID | undefined = location.query.contactId

      if (!contactId) {
        setContact(null)

        return
      }

      const response = await getContact(contactId)

      setContact(response.data)
    }

    fetchContact()
  }, [location.query.contactId])

  useEffect(() => {
    async function fetchListing() {
      const listingId: UUID | undefined = location.query.listingId

      if (!listingId) {
        setListing(null)

        return
      }

      const fetchedListing = await getListing(listingId)

      setListing(fetchedListing)
    }

    fetchListing()
  }, [location.query.listingId])

  if (listing) {
    return (
      <ListingFlow
        {...props}
        handleTrigger={() => {
          goTo('/dashboard/marketing')
        }}
        hasExternalTrigger
        hideTemplatesColumn={false}
        listing={listing}
        mediums={location.query.medium}
        types={location.query.templateType.split(',')}
      />
    )
  }

  if (contact) {
    return (
      <ContactFlow
        {...props}
        handleTrigger={() => {
          goTo('/dashboard/marketing')
        }}
        isBuilderOpen
        hasExternalTrigger
        hideTemplatesColumn={false}
        contact={contact}
        mediums={location.query.medium}
        types={location.query.templateType.split(',')}
      />
    )
  }

  return null
}

export default withRouter(StatefulUrlAdapter)
