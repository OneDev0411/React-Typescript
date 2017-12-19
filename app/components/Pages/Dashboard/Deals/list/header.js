import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router'
import AgentFilter from './agent-filter'
import BackOfficeFilter from './backoffice-filter'
import SearchInput from '../../../../Partials/SearchInput'
import debounce from 'lodash/debounce'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.debounced_version = debounce(this.onInputChange, 700)
  }

  onInputChange(value) {
    const { isBackOffice, onFilterChange, searchAllDeals, refetchDeals } = this.props
    let filters

    if (isBackOffice) {
      if (value) {
        searchAllDeals(value)
      } else if (this.lastQuery) {
        refetchDeals()
      }
    } else {
      filters = { 'address^side': value }
    }

    this.lastQuery = value
    onFilterChange(filters)
  }

  render() {
    const { isBackOffice, onFilterChange, activeFilterTab } = this.props

    return (
      <Row className="deals-list-header">
        <Col
          lg={isBackOffice ? 9 : 7}
          md={isBackOffice ? 7 : 6}
          sm={6}
          xs={12}
        >
          {
            isBackOffice ?
              <BackOfficeFilter
                active={activeFilterTab}
                onChangeFilter={filters => onFilterChange(filters)}
              /> :
              <AgentFilter
                active={activeFilterTab}
                onChangeFilter={filters => onFilterChange(filters)}
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
          <SearchInput
            onChange={value => this.debounced_version(value)}
            placeholder="Search by address or a person's name"
          />

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
    )
  }
}

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice
}))(Header)
