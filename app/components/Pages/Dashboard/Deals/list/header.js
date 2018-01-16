import React from 'react'
import { connect } from 'react-redux'
import {
  OverlayTrigger,
  Tooltip,
  Panel
} from 'react-bootstrap'
import { Link } from 'react-router'
import AgentFilter from './agent-filter'
import BackOfficeFilter from './backoffice-filter'
import debounce from 'lodash/debounce'
import {
  searchAllDeals,
  cleanSearchedDeals
} from '../../../../../store_actions/deals'
import Excel from '../../Partials/Svgs/Excel'
import cn from 'classnames'
import config from '../../../../../../config/public'

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
      isBackOffice,
      onFilterChange,
      searchAllDeals,
      searchBOFilters,
      showEmptySearchPage
    } = this.props
    let filters

    if (isBackOffice) {
      if (value) {
        searchAllDeals(value)
        showEmptySearchPage(false)
      } else {
        showEmptySearchPage(true)
      }

      searchBOFilters()
    } else {
      filters = { 'address^side^mlsSearch': value }
      onFilterChange(filters)
    }
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
      cleanSearchedDeals,
      user
    } = this.props

    const { inputFocused } = this.state
    let showSearchInput = true

    if (!isBackOffice && activeFilterTab && activeFilterTab !== 'All') {
      showSearchInput = false
    }

    return (
      <div
        className={cn('deals-list--header', { agent: !isBackOffice })}
      >
        <div style={{ height: '57px' }}>
          <div
            className={cn('deals-list--header-row', { agent: !isBackOffice })}
          >
            <div className="deals-list--header-row--col">
              {
                isBackOffice ?
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
                    }
                    }
                  /> :
                  <AgentFilter
                    active={activeFilterTab}
                    onChangeFilter={filters => {
                      initialAgentFilters(filters)

                      if (this.searchInput) {
                        this.searchInput.value = ''
                      }
                    }}
                  />
              }
            </div>

            <div className="deals-list--header-row--col">
              {isBackOffice &&
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="popover-leave">
                    Search deals by address,
                    <br />
                    MLS # or agent name…
                  </Tooltip>
                }
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
                    className={cn('fa fa-search', { active: searchBoxIsOpen })}
                    aria-hidden="true"
                  />
                </div>
              </OverlayTrigger>
              }
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="popover-leave">
                      Download Report
                  </Tooltip>
                  }
              >
                <a
                  download
                  href="/api/deals/excel/"
                  className="search-button"
                >
                  <Excel />
                </a>
              </OverlayTrigger>
              {
                !isBackOffice &&
                <Link
                  to="/dashboard/deals/create"
                  className="btn btn-primary create-deal-button"
                >
                  Create New Deal
                </Link>
              }
            </div>
          </div>
        </div>
        {showSearchInput &&
        <Panel
          className={cn({ agent: !isBackOffice })}
          collapsible
          expanded={isBackOffice ? searchBoxIsOpen : true}
          onEntered={() => this.searchInput.focus()}
        >
          <div
            className={cn('deals-list--header--searchBox', { active: inputFocused })}
          >
            <i
              className="fa fa-search"
              aria-hidden="true"
            />
            <input
              onChange={() => this.debouncedOnInputChange()}
              onFocus={() => this.setState({ inputFocused: true })}
              onBlur={() => this.setState({ inputFocused: false })}
              ref={ref => this.searchInput = ref}
              type="text"
              placeholder="Search deals by address, MLS # or agent name…"
            />
          </div>
        </Panel>
        }
      </div>
    )
  }
}

export default connect(({ user, deals }) => ({
  isBackOffice: deals.backoffice,
  user
}), {
  searchAllDeals,
  cleanSearchedDeals
})(Header)
