import React from 'react'
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import { Link } from 'react-router'
import AgentFilter from './agent-filter'
import BackOfficeFilter from './backoffice-filter'
import Tooltip from '../components/tooltip'
import debounce from 'lodash/debounce'
import { browserHistory } from 'react-router'

import {
  searchAllDeals,
  cleanSearchedDeals
} from '../../../../../store_actions/deals'
import Excel from '../../Partials/Svgs/Excel'
import cn from 'classnames'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.debouncedOnInputChange = debounce(this.onInputChange, 700)

    this.state = {
      inputFocused: false
    }
    browserHistory.listen(location => {
      const searchBoxIsOpen = this.props.filters.searchResult

      if (searchBoxIsOpen && location.pathname.includes('/dashboard/deals')) {
        props.removeSearchFilter()
        props.cleanSearchedDeals()

        if (this.searchInput) {
          this.searchInput.value = ''
        }
      }
    })
  }

  onInputChange() {
    const { value } = this.searchInput
    const {
      searchAllDeals,
      searchBOFilters,
      showEmptySearchPage,
      isBackOffice,
      removeSearchFilter
    } = this.props

    if (value && value.length > 3) {
      searchAllDeals(value, isBackOffice)
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
    const {
      isBackOffice,
      activeFilterTab,
      showEmptySearchPage,
      cleanSearchedDeals,
      removeSearchFilter,
      filters,
      searchBOFilters
    } = this.props
    const searchBoxIsOpen = filters.searchResult
    const { inputFocused } = this.state
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
                  <div
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
                    className="search-button"
                  >
                    <i
                      className={cn('fa fa-search', {
                        active: searchBoxIsOpen
                      })}
                      aria-hidden="true"
                    />
                  </div>
                </Tooltip>
              )}

              <Tooltip placement="bottom" caption="Download Report">
                <a href="/api/deals/excel/" className="search-button">
                  <Excel />
                </a>
              </Tooltip>

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
  ({ deals }) => ({
    isBackOffice: deals.backoffice
  }),
  {
    searchAllDeals,
    cleanSearchedDeals
  }
)(Header)
