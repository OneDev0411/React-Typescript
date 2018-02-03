import React from 'react'
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import { Link } from 'react-router'
import AgentFilter from './agent-filter'
import BackOfficeFilter from './backoffice-filter'
import Tooltip from '../components/tooltip'
import debounce from 'lodash/debounce'
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
  }

  onInputChange() {
    const { value } = this.searchInput
    const {
      searchAllDeals,
      searchBOFilters,
      showEmptySearchPage,
      isBackOffice
    } = this.props

    if (value && value.length > 0) {
      searchAllDeals(value, isBackOffice)
      showEmptySearchPage(false)
    } else {
      showEmptySearchPage(true)
    }

    searchBOFilters()
  }

  render() {
    const {
      isBackOffice,
      onFilterChange,
      activeFilterTab,
      searchBoxIsOpen,
      setSearchStatus,
      initialBOFilters,
      showEmptySearchPage,
      initialAgentFilters,
      cleanSearchedDeals
    } = this.props

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
                  onChangeFilter={filters => {
                    if (this.searchInput) {
                      this.searchInput.value = ''
                    }

                    if (searchBoxIsOpen) {
                      setSearchStatus(false)
                      initialBOFilters(filters)
                      cleanSearchedDeals()
                    } else {
                      onFilterChange(filters)
                    }
                  }}
                />
              ) : (
                <AgentFilter
                  active={activeFilterTab}
                  onChangeFilter={filters => {
                    if (this.searchInput) {
                      this.searchInput.value = ''
                    }

                    if (searchBoxIsOpen) {
                      setSearchStatus(false)
                      initialAgentFilters(filters)
                      cleanSearchedDeals()
                    } else {
                      onFilterChange(filters)
                    }
                  }}
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
                      setSearchStatus(!searchBoxIsOpen)

                      if (searchBoxIsOpen) {
                        this.searchInput.value = ''
                      } else {
                        showEmptySearchPage(true)
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
