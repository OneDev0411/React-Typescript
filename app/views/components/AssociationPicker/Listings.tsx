import { MenuItem } from '@material-ui/core'

import {
  addressTitle,
  getAddressLine2,
  getListingAddressObj
} from '@app/utils/listing'
import { truncateTextFromMiddle } from '@app/utils/truncate-text-from-middle'

import { LoadingSkeleton } from './LoadingSkeleton'
import { NotFound } from './NotFound'
import { useListingsList } from './queries/use-listings-list'
import { RowItem } from './RowItem'
import { SectionTitle } from './SectionTitle'

interface Props {
  criteria: string
  onSelect: (listing: IListing | ICompactListing) => void
}

export function Listings({ criteria, onSelect }: Props) {
  const { data: listings, isLoading: isFetchingListings } =
    useListingsList(criteria)

  if (!isFetchingListings && listings === undefined) {
    return null
  }

  return (
    <div>
      <SectionTitle text="Listings" />

      {!isFetchingListings &&
        listings?.map(listing => {
          const address = getListingAddressObj(listing)

          return (
            <MenuItem key={listing.id} onClick={() => onSelect(listing)}>
              <RowItem
                avatarUrl={listing.cover_image_url}
                title={
                  typeof address === 'string' ? address : addressTitle(address)
                }
                subtitle={
                  typeof address === 'object'
                    ? truncateTextFromMiddle(
                        `${getAddressLine2(
                          address
                        )} $${listing.price.toLocaleString()}`,
                        45
                      )
                    : null
                }
                status={listing.status}
                mlsName={listing.mls_display_name}
              />
            </MenuItem>
          )
        })}

      {isFetchingListings && <LoadingSkeleton />}
      {!isFetchingListings && !listings?.length && <NotFound />}
    </div>
  )
}
