import React from 'react'
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import styled from 'styled-components'
import Tooltip from '../../../../../views/components/tooltip/index'
import debounce from 'lodash/debounce'
import cn from 'classnames'
import BackOfficeFilter from './backoffice-filter'
import AgentFilter from './agent-filter'
import { getActiveTeamId } from '../../../../../utils/user-teams'
import {
  searchAllDeals,
  cleanSearchedDeals
} from '../../../../../store_actions/deals'
import DealsDownload from './DealsDownload'

const DealsSearchButton = styled.div`
  cursor: pointer;
  padding: 10px;
  display: flex;
  .fa-search {
    color: #8da2b5;
    font-size: 20px;
    &:hover,
    &.active {
      color: #2196f3;
    }
  }

  &:hover svg > g {
    fill: #2196f3;
  }
`

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputFocused: false
    }

    this.debouncedOnInputChange = debounce(this.onInputChange, 700)

    browserHistory.listen(location => {
      const searchBoxIsOpen = this.props.filters.searchResult

      if (
        searchBoxIsOpen &&
        location.pathname.includes('/dashboard/deals/filter')
      ) {
        props.removeSearchFilter()
        props.cleanSearchedDeals()

        if (this.searchInput) {
          this.searchInput.value = ''
        }
      }
    })
  }

  onInputChange() {
    // #1472
    if (!this.searchInput) {
      return null
    }

    const { value } = this.searchInput
    const {
      searchAllDeals,
      searchBOFilters,
      showEmptySearchPage,
      isBackOffice,
      removeSearchFilter,
      user
    } = this.props
    const brandId = getActiveTeamId(user)

    if (value && value.length > 3) {
      searchAllDeals({ query: value, brand: brandId }, isBackOffice)
      showEmptySearchPage(false)
      searchBOFilters()
    } else if (!value && !isBackOffice) {
      showEmptySearchPage(false)
      removeSearchFilter()
    } else {
      showEmptySearchPage(true)
      searchBOFilters()
    }
  }

  onChangeFilter = filters => {
    const { initialFilters } = this.props

    if (this.searchInput) {
      this.searchInput.value = ''
    }

    initialFilters(filters)
  }

  render() {
    const { inputFocused } = this.state
    const {
      isBackOffice,
      activeFilterTab,
      showEmptySearchPage,
      cleanSearchedDeals,
      removeSearchFilter,
      filters,
      searchBOFilters,
      user
    } = this.props

    const searchBoxIsOpen = filters.searchResult

    let showSearchInput = true

    if (!isBackOffice && activeFilterTab && activeFilterTab !== 'All') {
      showSearchInput = false
    }

    return (
      <div className={cn('list--header', { agent: !isBackOffice })}>
        <div style={{ height: '57px' }}>
          <div className={cn('list--header-row', { agent: !isBackOffice })}>
            <div className="list--header-row--col">
              {isBackOffice ? (
                <BackOfficeFilter
                  searchMode={searchBoxIsOpen}
                  active={activeFilterTab}
                  onChangeFilter={this.onChangeFilter}
                />
              ) : (
                <AgentFilter
                  active={activeFilterTab}
                  onChangeFilter={this.onChangeFilter}
                />
              )}
            </div>

            <div className="list--header-row--col">
              {isBackOffice && (
                <Tooltip
                  multiline
                  placement="bottom"
                  caption="Search deals by address,<br />MLS # or agent name…"
                >
                  <DealsSearchButton
                    onClick={() => {
                      if (searchBoxIsOpen) {
                        this.searchInput.value = ''
                        removeSearchFilter()
                        cleanSearchedDeals()
                      } else {
                        showEmptySearchPage(true)
                        searchBOFilters()
                      }
                    }}
                  >
                    <i
                      className={cn('fa fa-search', {
                        active: searchBoxIsOpen
                      })}
                      aria-hidden="true"
                    />
                  </DealsSearchButton>
                </Tooltip>
              )}

              <DealsDownload user={user} />
              {!isBackOffice && (
                <Link
                  to="/dashboard/deals/create"
                  className="btn btn-primary create-button"
                >
                  Create New Deal
                </Link>
              )}
            </div>
          </div>
        </div>

        {showSearchInput && (
          <Panel
            className={cn('list--header', { agent: !isBackOffice })}
            collapsible
            expanded={isBackOffice ? searchBoxIsOpen : true}
            onEntered={() => this.searchInput.focus()}
          >
            <div
              className={cn('list--header--searchBox', {
                active: inputFocused
              })}
            >
              <i className="fa fa-search" aria-hidden="true" />
              <input
                onChange={() => this.debouncedOnInputChange()}
                onFocus={() => this.setState({ inputFocused: true })}
                onBlur={() => this.setState({ inputFocused: false })}
                ref={ref => (this.searchInput = ref)}
                type="text"
                placeholder="Search deals by address, MLS # or agent name…"
              />
            </div>
          </Panel>
        )}
      </div>
    )
  }
}

export default connect(
  ({ deals, user }) => ({
    user,
    isBackOffice: deals.backoffice
  }),
  {
    searchAllDeals,
    cleanSearchedDeals
  }
)(Header)
