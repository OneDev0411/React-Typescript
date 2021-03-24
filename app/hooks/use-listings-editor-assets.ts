import { useMemo } from 'react'

interface ListingAsset {
  image: string
  listing: string
}

function useListingsEditorAssets(
  listings: Nullable<IListing[]>
): ListingAsset[] {
  return useMemo(() => {
    const assets: ListingAsset[] = []

    if (listings && Array.isArray(listings)) {
      listings.forEach(listing => {
        if (
          listing.gallery_image_urls &&
          Array.isArray(listing.gallery_image_urls)
        ) {
          const uniqueAssets = [...new Set(listing.gallery_image_urls)]

          uniqueAssets.forEach(image => {
            assets.push({
              listing: listing.id,
              image
            })
          })
        }
      })
    }

    return assets
  }, [listings])
}

export default useListingsEditorAssets
