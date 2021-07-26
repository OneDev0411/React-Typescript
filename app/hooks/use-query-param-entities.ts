import { useState, useEffect } from 'react'

import { decode } from 'js-base64'

import { useQueryParamValue } from '@app/hooks/use-query-param'
import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import { getContact } from 'models/contacts/get-contact'
import getListing from 'models/listings/listing/get-listing'

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
  field: string = LISTING_ID_QUERY_KEY
): UseListingById {
  const [listing, setListing] = useState<Nullable<IListing>>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Nullable<Error>>(null)
  const listingId = useQueryParamValue(field)
  const serializedListingImages = useQueryParamValue(LISTING_IMAGES_QUERY_KEY)

  useEffect(() => {
    async function fetchListing() {
      if (!listingId) {
        const mockedListing = (await getMockListing()) as unknown as IListing

        const images: string[] = serializedListingImages
          ? serializedListingImages.split(',').map(decode)
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
  }, [listingId, serializedListingImages])

  return {
    listing,
    isLoading,
    error
  }
}

interface UseContactById extends UseEntityById {
  contact: Nullable<IContact>
}

export function useContactById(field: string = 'contactId'): UseContactById {
  const [contact, setContact] = useState<Nullable<IContact>>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Nullable<Error>>(null)
  const contactId = useQueryParamValue(field)

  useEffect(() => {
    async function fetchContact() {
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
  }, [contactId])

  return {
    contact,
    isLoading,
    error
  }
}
