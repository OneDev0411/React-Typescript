import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'
import { WithRouterProps } from 'react-router'

import getListing from 'models/listings/listing/get-listing'
import { getContact } from 'models/contacts/get-contact'

interface UseEntityById {
  isLoading: boolean
  error: Nullable<Error>
}

interface UseListingById extends UseEntityById {
  listing: Nullable<IListing>
}

export function useListingById(
  location: WithRouterProps['location'],
  field: string = 'listingId'
): UseListingById {
  const [listing, setListing] = useState<Nullable<IListing>>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Nullable<Error>>(null)

  useDeepCompareEffect(() => {
    async function fetchListing() {
      const listingId: Optional<UUID> = location.query[field]

      if (!listingId) {
        setListing(null)
        setIsLoading(false)
        setError(null)

        return
      }

      try {
        setIsLoading(true)

        const fetchedListing = await getListing(listingId)

        setError(null)
        setListing(fetchedListing)
      } catch (err) {
        setError(err)
        setListing(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchListing()
  }, [location.query, field])

  return {
    listing,
    isLoading,
    error
  }
}

interface UseContactById extends UseEntityById {
  contact: Nullable<IContact>
}

export function useContactById(
  location: WithRouterProps['location'],
  field: string = 'contactId'
): UseContactById {
  const [contact, setContact] = useState<Nullable<IContact>>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Nullable<Error>>(null)

  useDeepCompareEffect(() => {
    async function fetchContact() {
      const contactId: Optional<UUID> = location.query[field]

      if (!contactId) {
        setContact(null)
        setIsLoading(false)
        setError(null)

        return
      }

      try {
        setIsLoading(true)

        const response = await getContact(contactId)

        setError(null)
        setContact(response.data)
      } catch (err) {
        setError(err)
        setContact(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContact()
  }, [location.query, field])

  return {
    contact,
    isLoading,
    error
  }
}
