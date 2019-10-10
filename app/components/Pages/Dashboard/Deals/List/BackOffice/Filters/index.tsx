import React from 'react'
import { connect } from 'react-redux'

import { IAppState } from 'reducers/index'

import SideNavSection from 'components/PageSideNav/SideNavSection'

import { SearchQuery } from '../types'

import InboxFilters from './InboxFilters'
import StaticFilters from './StaticFilters'

interface StateProps {
  deals: IDealList
}

interface Props {
  searchQuery: SearchQuery
  isFetchingDeals: boolean
  onBackToInboxes(): void
}

function BackofficeFilters(props: Props & StateProps) {
  return (
    <SideNavSection>
      <InboxFilters
        searchQuery={props.searchQuery}
        deals={props.deals}
        onBackToInboxes={props.onBackToInboxes}
        isFetchingDeals={props.isFetchingDeals}
      />

      <StaticFilters searchQuery={props.searchQuery} deals={props.deals} />
    </SideNavSection>
  )
}

function mapStateToProps({ deals }: IAppState): StateProps {
  return {
    deals: deals.list
  }
}

export default connect(mapStateToProps)(BackofficeFilters)
