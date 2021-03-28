import { useMemo } from 'react'

import type { MarketingListingAsset } from 'components/InstantMarketing'

function useListingsEditorAssets(
  listings: Nullable<IListing[]>
): MarketingListingAsset[] {
  return useMemo(() => {
    if (!listings) {
      return []
    }

    return listings.reduce(
      (assets, listing) => [
        ...assets,
        ...[...new Set(listing.gallery_image_urls)].map(image => ({
          listing: listing.id,
          image
        }))
      ],
      []
    )
  }, [listings])
}

export default useListingsEditorAssets
