import React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Panel
} from 'react-bootstrap'
import { Link } from 'react-router'
import AgentFilter from './agent-filter'
import BackOfficeFilter from './backoffice-filter'
import debounce from 'lodash/debounce'
import {
  searchAllDeals
} from '../../../../../store_actions/deals'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.debouncedOnInputChange = debounce(this.onInputChange, 700)
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
      filters = { 'address^side': value }
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
      initialAgentFilters
    } = this.props

    let showSearchInput = true

    if (!isBackOffice && activeFilterTab && activeFilterTab !== 'All') {
      showSearchInput = false
    }

    return (
      <div className="deals-list--header">
        <Row>
          <Col
            lg={isBackOffice ? 9 : 7}
            md={isBackOffice ? 7 : 6}
            sm={6}
            xs={12}
          >
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
                    }

                    onFilterChange(filters)
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
          </Col>

          <Col
            lg={isBackOffice ? 3 : 5}
            md={isBackOffice ? 5 : 6}
            sm={6}
            xs={12}
            className="text-right"
          >
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
              <span
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
                <i className="fa fa-search" aria-hidden="true" />
              </span>
            </OverlayTrigger>
            }
            {
              !isBackOffice &&
              <Link
                to="/dashboard/deals/create"
                className="btn btn-primary create-deal-button"
              >
                Create New Deal
              </Link>
            }
          </Col>
        </Row>
        {showSearchInput &&
        <Panel collapsible expanded={isBackOffice ? searchBoxIsOpen : true}>
          <div
            className="deals-list--header--searchBox"
          >
            <i
              className="fa fa-search"
              aria-hidden="true"
            />
            <input
              onChange={() => this.debouncedOnInputChange()}
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

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice
}), {
  searchAllDeals
})(Header)
