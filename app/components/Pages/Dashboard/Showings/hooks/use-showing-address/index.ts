import { getField } from 'models/Deal/helpers/context'

export type UseShowingAddressProps = Pick<
  IShowing,
  'deal' | 'listing' | 'address'
>

function useShowingAddress({
  deal,
  listing,
  address
}: UseShowingAddressProps): string {
  return (
    getField(deal, 'full_address') ||
    deal?.title ||
    listing?.property.address.street_address ||
    address?.full
  )
}

export default useShowingAddress
