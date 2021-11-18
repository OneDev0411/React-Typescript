import { getArrayWithFallbackAccessor } from '@app/utils/get-array-with-fallback-accessor'
import { PLACEHOLDER_IMAGE_URL } from 'components/InstantMarketing/constants'

interface UseListingsEditorTemplateData {
  listing?: IListing
  listings?: IListing[]
}

function useListingsEditorTemplateData(
  listings: Nullable<IListing[]>,
  isMultiListing: boolean
): UseListingsEditorTemplateData {
  if (!listings) {
    return {}
  }

  const data: UseListingsEditorTemplateData = {}

  const improvedListings = listings.map(listing => ({
    ...listing,
    gallery_image_urls: getArrayWithFallbackAccessor(
      listing.gallery_image_urls ?? [],
      PLACEHOLDER_IMAGE_URL
    )
  }))

  if (isMultiListing) {
    data.listings = improvedListings
  } else {
    data.listing = improvedListings[0]
  }

  return data
}

export default useListingsEditorTemplateData
