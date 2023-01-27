import { useMemo, useState } from 'react'

import { mdiPlus, mdiChevronUp } from '@mdi/js'

import { useUnsafeActiveBrandId } from '@app/hooks/brand/use-unsafe-active-brand-id'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { sortDealsStatus } from 'utils/sort-deals-status'

import { SectionButton } from '../components/Section/Button'

import { DealItem } from './Item'

interface Props {
  contact: IContact
  deals: IDeal[]
}

const TOGGLE_ITEM_COUNT = 3

export function List({ deals, contact }: Props) {
  const activeBrandId = useUnsafeActiveBrandId()
  const [toggleEmptyAttributes, setToggleEmptyAttributes] = useState(false)
  const [statuses] = useBrandStatuses(activeBrandId || '')

  const handleToggleEmptyFields = () => {
    setToggleEmptyAttributes(prevState => !prevState)
  }

  const items = useMemo(() => {
    const activeDeals = deals.filter(deal => !deal.deleted_at)

    const sortedDealsByStatus = sortDealsStatus(activeDeals, statuses)

    return toggleEmptyAttributes
      ? sortedDealsByStatus
      : sortedDealsByStatus.slice(0, TOGGLE_ITEM_COUNT)
  }, [deals, statuses, toggleEmptyAttributes])

  return (
    <>
      {items.map(deal => (
        <DealItem key={deal.id} deal={deal} contact={contact} />
      ))}
      {deals.length > TOGGLE_ITEM_COUNT && (
        <SectionButton
          label={!toggleEmptyAttributes ? 'More' : 'Hide empty fields'}
          icon={!toggleEmptyAttributes ? mdiPlus : mdiChevronUp}
          onClick={handleToggleEmptyFields}
        />
      )}
    </>
  )
}
