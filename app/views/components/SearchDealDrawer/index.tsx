import React, { ComponentProps } from 'react'

import { useSelector } from 'react-redux'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import Drawer from 'components/OverlayDrawer'
import { IAppState } from 'reducers'
import { selectDeals } from 'reducers/deals/list'

import Body from './Body'

interface Props extends Pick<ComponentProps<typeof Drawer>, 'onClose'> {
  defaultSearchFilter?: string
  onSelect: (deal: IDeal) => void
  itemRenderer?: React.ReactNode
  isOpen: boolean
  title: string
}

export default function SearchDealDrawer({
  defaultSearchFilter = '',
  isOpen,
  onClose,
  title,
  onSelect,
  itemRenderer
}: Props) {
  const activeTeam = useUnsafeActiveTeam()
  const deals: IDeal[] = useSelector((state: IAppState) =>
    selectDeals(state.deals.list)
  )

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <Drawer.Header title={title} />
      <Drawer.Body>
        <Body
          isDrawer
          team={activeTeam}
          deals={deals}
          itemRenderer={itemRenderer}
          handleSelectedItem={onSelect}
          defaultSearchFilter={defaultSearchFilter}
        />
      </Drawer.Body>
    </Drawer>
  )
}
