import React, { useEffect, useCallback } from 'react'
import { browserHistory, Link } from 'react-router'
import _ from 'underscore'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import LoadingContainer from 'components/LoadingContainer'

import SideNavSection from 'components/PageSideNav/SideNavSection'
import SideNavTitle from 'components/PageSideNav/SideNavTitle'
import SideNavItem from 'components/PageSideNav/SideNavItem'

import { SearchQuery } from '../../types'
import { getFilterUrl } from '../../../utils'

interface Props {
  searchQuery: SearchQuery
  deals: IDealList
  isFetchingDeals: boolean
  onBackToInboxes(): void
}

export default function InboxFilters(props: Props) {
  const findActiveTab = useCallback(
    (deals: IDealList, activeFilter: string): void => {
      if (props.searchQuery.type !== 'inbox') {
        return
      }

      const tabs = getTabs(deals)

      // get active tab
      const activeTab = activeFilter || (tabs && tabs[0])

      if (activeTab) {
        setFilter(activeTab)
      }
    },
    [props.searchQuery.type]
  )

  const setFilter = (filter: string): void => {
    browserHistory.push(
      getFilterUrl(filter, {
        type: 'inbox'
      })
    )
  }

  const getTabs = (deals = {}) => {
    return _.chain(deals)
      .pluck('inboxes')
      .flatten()
      .uniq()
      .filter(tab => tab !== null)
      .value()
  }

  const getBadgeCounter = (tabName = '') => {
    let counter = 0

    if (props.searchQuery.term.length > 0) {
      return Object.values(props.deals).filter(deal => !deal.is_draft).length
    }

    Object.values(props.deals).forEach(deal => {
      if (
        deal.inboxes &&
        deal.inboxes.includes(tabName) &&
        deal.attention_requests > 0 &&
        deal.is_draft === false
      ) {
        counter += 1
      }
    })

    return counter
  }

  const handleBackToInboxes = () => {
    browserHistory.push('/dashboard/deals')
    props.onBackToInboxes()
  }

  useEffectOnce(() => {
    findActiveTab(props.deals, props.searchQuery.filter)
  })

  useEffect(() => {
    if (!props.searchQuery.filter) {
      findActiveTab(props.deals, props.searchQuery.filter)
    }
  }, [props.searchQuery.filter, props.deals, findActiveTab])

  const tabs = getTabs(props.deals)

  if (props.searchQuery.type === 'query') {
    return (
      <Link to="/dashboard/deals" onClick={handleBackToInboxes}>
        <SideNavTitle>Back To Inboxes</SideNavTitle>
      </Link>
    )
  }

  if (props.isFetchingDeals) {
    return (
      <SideNavSection>
        <SideNavTitle>Inboxes</SideNavTitle>
        <LoadingContainer size="3rem" style={{ padding: 0 }} />
      </SideNavSection>
    )
  }

  return (
    <SideNavSection>
      <SideNavTitle>Inboxes</SideNavTitle>

      {props.searchQuery.term.length > 0 ? (
        <SideNavItem
          isSelected
          title="Search Results"
          badge={getBadgeCounter()}
        />
      ) : (
        <>
          {tabs.map(tabName => {
            const counter = getBadgeCounter(tabName)

            if (counter === 0) {
              return false
            }

            return (
              <SideNavItem
                key={`FILTER_${tabName}`}
                link={getFilterUrl(tabName, {
                  type: 'inbox'
                })}
                title={tabName}
                badge={counter}
              />
            )
          })}
        </>
      )}
    </SideNavSection>
  )
}
