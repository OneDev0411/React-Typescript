import React from 'react'

import SideNavTitle from 'components/PageSideNav/SideNavTitle'
import SideNavItem from 'components/PageSideNav/SideNavItem'

import { getFilterUrl } from '../../../utils'
import { SearchQuery } from '../../types'

interface Props {
  searchQuery: SearchQuery
  deals: IDealList
}

export default function StaticFilters(props: Props) {
  const counter = props.deals ? Object.keys(props.deals).length : 0
  const isStaticFilter = props.searchQuery.type === 'query'

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <SideNavTitle>All Deals</SideNavTitle>

      <SideNavItem
        link={getFilterUrl('listing', {
          type: 'query'
        })}
        title="Listing"
        badge={
          isStaticFilter && counter && props.searchQuery.filter === 'listing'
            ? counter
            : undefined
        }
      />

      <SideNavItem
        link={getFilterUrl('contract', {
          type: 'query'
        })}
        title="Contract"
        badge={
          isStaticFilter && counter && props.searchQuery.filter === 'contract'
            ? counter
            : undefined
        }
      />
    </div>
  )
}
