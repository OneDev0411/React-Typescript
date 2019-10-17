import React, { useState } from 'react'
import { connect } from 'react-redux'

import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'

import { IAppState } from 'reducers/index'

import PageSideNav from 'components/PageSideNav'
import { Content } from 'components/SlideMenu'
import Search from 'components/Grid/Search'
import { searchDeals, getDeals } from 'actions/deals'

import { PageContainer, GridContainer } from '../styles/page-container/styled'

import { SearchQuery } from './types'

import { getPageTitle } from './utils/get-page-title'
import { getStaticFilterQuery } from './utils/get-static-filter-query'

import PageHeader from '../components/PageHeader'
import Grid from './Grid'
import BackofficeFilters from './Filters'

let persistentSearchInput = ''

interface RouterProps {
  params?: any
  location?: any
}

interface StateProps {
  user: IUser
  isFetchingDeals: boolean
  getDeals(user: IUser): void
  searchDeals(user: IUser, value: object | string): void
}

function BackofficeTable(props: RouterProps & StateProps) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(true)
  const [searchCriteria, setSearchCriteria] = useState<string>(
    persistentSearchInput
  )

  const searchQuery: SearchQuery = {
    filter: props.params.filter,
    type: props.location.query.type || 'inbox',
    term: searchCriteria
  }

  const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen)

  const handleSearch = (value: string): void => {
    setSearchCriteria(value)

    // set persistent search input
    persistentSearchInput = value

    if (value.length === 0) {
      return props.getDeals(props.user)
    }

    props.searchDeals(props.user, value)
  }

  useDeepCompareEffect(() => {
    if (searchQuery.type === 'query') {
      props.searchDeals(props.user, getStaticFilterQuery(searchQuery))
    }
  }, [searchQuery])

  return (
    <PageContainer isOpen={isSideMenuOpen}>
      <PageSideNav isOpen={isSideMenuOpen}>
        <BackofficeFilters
          searchQuery={searchQuery}
          isFetchingDeals={props.isFetchingDeals}
          onBackToInboxes={() => handleSearch('')}
        />
      </PageSideNav>

      <Content isSideMenuOpen={isSideMenuOpen}>
        <PageHeader
          title={getPageTitle(searchQuery)}
          isSideMenuOpen={isSideMenuOpen}
          onMenuTriggerChange={toggleSideMenu}
        />

        <GridContainer>
          {/*
          // @ts-ignore TODO: js component */}
          <Search
            disableOnSearch
            showLoadingOnSearch
            defaultValue={persistentSearchInput}
            isSearching={props.isFetchingDeals}
            placeholder="Search deals by address, MLS # or agent name…"
            onChange={handleSearch}
            onClearSearch={handleSearch}
            debounceTime={600}
            minimumLength={4}
          />

          {/*
          // @ts-ignore TODO: js component */}
          <Grid searchQuery={searchQuery} />
        </GridContainer>
      </Content>
    </PageContainer>
  )
}

function mapStateToProps({ user, deals }: IAppState) {
  return {
    user,
    isFetchingDeals: deals.properties.isFetchingDeals
  }
}

export default connect(
  mapStateToProps,
  { searchDeals, getDeals }
)(BackofficeTable)
