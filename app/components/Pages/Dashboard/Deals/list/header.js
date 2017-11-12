import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router'
import AgentFilter from './agent-filter'
import BackOfficeFilter from './backoffice-filter'
import SearchInput from '../../../../Partials/SearchInput'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  onInputChange(value) {
    const { isBackOffice, onFilterChange } = this.props
    let filters

    if (isBackOffice) {
      filters = { 'address^agent_name': value }
    } else {
      filters = { 'address^side': value }
    }

    onFilterChange(filters)
  }

  render() {
    const { isBackOffice, onFilterChange, activeFilterTab } = this.props

    return (
      <Row className="deals-list-header">
        <Col
          lg={isBackOffice ? 9 : 6}
          md={isBackOffice ? 7 : 5}
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
          lg={isBackOffice ? 3 : 6}
          md={isBackOffice ? 5 : 7}
          sm={6}
          xs={12}
          className="text-right"
        >
          <SearchInput
            onChange={value => this.onInputChange(value)}
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
