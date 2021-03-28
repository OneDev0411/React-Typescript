import { useState, useEffect } from 'react'
import { WithRouterProps } from 'react-router'
import { decode } from 'js-base64'

import getListing from 'models/listings/listing/get-listing'
import { getContact } from 'models/contacts/get-contact'

import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'

interface UseEntityById {
  isLoading: boolean
  error: Nullable<Error>
}

export const LISTING_ID_QUERY_KEY = 'listingId'
const LISTING_IMAGES_QUERY_KEY = 'imageUrls'

interface UseListingById extends UseEntityById {
  listing: Nullable<IListing>
}

export function useListingById(
  location: WithRouterProps['location']
): UseListingById {
  const [listing, setListing] = useState<Nullable<IListing>>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Nullable<Error>>(null)

  useEffect(() => {
    async function fetchListing() {
      const listingId: Optional<UUID> = location.query[LISTING_ID_QUERY_KEY]

      if (!listingId) {
        const mockedListing = ((await getMockListing()) as unknown) as IListing

        const images: string[] = location.query[LISTING_IMAGES_QUERY_KEY]
          ? location.query[LISTING_IMAGES_QUERY_KEY].split(',').map(decode)
          : []

        setListing({
          ...mockedListing,
          gallery_image_urls: images.length
            ? images
            : mockedListing.gallery_image_urls
        })

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
  }, [location.query])

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

  useEffect(() => {
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
