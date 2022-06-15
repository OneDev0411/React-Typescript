import { useMemo } from 'react'

interface Props {
  associations?: ICRMTaskAssociation<'deal' | 'listing'>[]
}

export function PropertyDealCell({ associations }: Props) {
  const [listings, deals] = useMemo(() => {
    const listings: ICRMTaskAssociation<'listing'>[] | undefined =
      associations?.filter(
        association => association.association_type === 'listing'
      )
    const deals: ICRMTaskAssociation<'deal'>[] | undefined =
      associations?.filter(
        association => association.association_type === 'deal'
      )

    return [listings, deals]
  }, [associations])

  if (listings && listings?.length > 0) {
    return <div>{listings[0].listing?.property?.address.full_address}</div>
  }

  if (deals && deals?.length > 0) {
    return <div>{deals[0].deal?.title}</div>
  }

  return null
}
