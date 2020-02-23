import React, { useState } from 'react'
import { connect } from 'react-redux'
import { WithRouterProps } from 'react-router'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'
import { TextField, makeStyles, createStyles, Theme } from '@material-ui/core'

import { IAppState } from 'reducers/index'

import GlobalHeader from 'components/GlobalHeader'

// import PageSideNav from 'components/PageSideNav'
// import { Content } from 'components/SlideMenu'
// import Search from 'components/Grid/Search'
import { searchDeals, getDeals } from 'actions/deals'

import { SORTABLE_COLUMNS } from './helpers/sortable-columns'
// import { PageContainer, GridContainer } from '../styles/page-container/styled'

import { ExportDeals } from '../components/ExportDeals'

import { SearchQuery } from './types'

// import { getPageTitle } from './utils/get-page-title'
import { getStaticFilterQuery } from './utils/get-static-filter-query'

// import PageHeader from '../components/PageHeader'
import Grid from './Grid'
// import BackofficeFilters from './Filters'

interface StateProps {
  user: IUser
  isFetchingDeals: boolean
  getDeals(user: IUser): void
  searchDeals(user: IUser, value: object | string): void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(0, 3)
    },
    headerContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    searchInput: {
      width: '70%',
      backgroundColor: theme.palette.grey[50]
    }
  })
)

function BackofficeTable(props: WithRouterProps & StateProps) {
  const classes = useStyles()

  const [searchCriteria, setSearchCriteria] = useState<string>('')

  const searchQuery: SearchQuery = {
    filter: props.params.filter,
    type: props.location.query.type || 'inbox',
    term: searchCriteria
  }

  const handleQueryChange = (e): void => {
    const { value } = e.target

    setSearchCriteria(value)

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
    <>
      <GlobalHeader title="My deals">
        <div className={classes.headerContainer}>
          <TextField
            className={classes.searchInput}
            size="small"
            variant="outlined"
            placeholder="Search deals by address, MLS# or agent name..."
            onChange={handleQueryChange}
          />

          <ExportDeals />
        </div>
      </GlobalHeader>

      <div className={classes.container}>
        {/* <TabFilters
          deals={deals}
          activeFilter={props.params.filter}
          searchCriteria={searchCriteria}
          sortableColumns={SORTABLE_COLUMNS}
        /> */}

        <Grid
          activeFilter={props.params.filter}
          sortableColumns={SORTABLE_COLUMNS}
        />
      </div>
    </>
  )
  // return (
  //   <PageContainer isOpen={isSideMenuOpen}>
  //     <PageSideNav isOpen={isSideMenuOpen}>
  //       <BackofficeFilters
  //         searchQuery={searchQuery}
  //         isFetchingDeals={props.isFetchingDeals}
  //         onBackToInboxes={() => handleSearch('')}
  //       />
  //     </PageSideNav>

  //     <Content isSideMenuOpen={isSideMenuOpen}>
  //       <PageHeader
  //         title={getPageTitle(searchQuery)}
  //         isSideMenuOpen={isSideMenuOpen}
  //         onMenuTriggerChange={toggleSideMenu}
  //       />

  //       <GridContainer>
  //         <Search
  //           disableOnSearch
  //           showLoadingOnSearch
  //           defaultValue={persistentSearchInput}
  //           isSearching={props.isFetchingDeals}
  //           placeholder="Search deals by address, MLS # or agent name…"
  //           onChange={handleSearch}
  //           onClearSearch={handleSearch}
  //           debounceTime={600}
  //           minimumLength={4}
  //         />

  //         <Grid searchQuery={searchQuery} />
  //       </GridContainer>
  //     </Content>
  //   </PageContainer>
  // )
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
