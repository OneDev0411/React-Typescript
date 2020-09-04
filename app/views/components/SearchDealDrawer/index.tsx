import React, { ComponentProps } from 'react'
import { connect } from 'react-redux'

import Drawer from 'components/OverlayDrawer'
import OverlayDrawer from 'components/OverlayDrawer'
import { selectDeals } from 'reducers/deals/list'

import Body from './Body'

interface Props extends Pick<ComponentProps<typeof OverlayDrawer>, 'onClose'> {
  defaultSearchFilter?: string
  onSelect: (deal: IDeal) => void
  user: IUser
  deals: IDeal[]
  itemRenderer?: React.ReactNode
  isOpen: boolean
  title: string
}

function SearchDealDrawer({
  defaultSearchFilter = '',
  isOpen,
  onClose,
  user,
  deals,
  title,
  onSelect,
  itemRenderer
}: Props) {
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <Drawer.Header title={title} />
      <Drawer.Body>
        <Body
          isDrawer
          user={user}
          deals={deals}
          itemRenderer={itemRenderer}
          handleSelectedItem={onSelect}
          defaultSearchFilter={defaultSearchFilter}
        />
      </Drawer.Body>
    </Drawer>
  )
}

function mapStateToProps(state) {
  return {
    user: state.user,
    deals: selectDeals(state.deals.list)
  }
}

export default connect(mapStateToProps)(SearchDealDrawer)
