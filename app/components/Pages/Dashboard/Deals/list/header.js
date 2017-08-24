import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import DealCreate from '../create'
import AgentFilter from './agent-filter'
import BackOfficeFilter from './backoffice-filter'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { isBackOffice, onFilterChange, activeFilterTab } = this.props

    return (
      <Row className="heading">
        <Col lg={6} md={5} sm={6} xs={12}>
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

        <Col lg={6} md={7} sm={6} xs={12} className="text-right">
          <input
            onChange={e => onFilterChange({ address: e.target.value })}
            className="search"
            type="text"
            placeholder="Type in to search ..."
          />

          {
            !isBackOffice &&
            <div className="inline">
              <DealCreate type="listing" />
              <DealCreate type="offer" />
            </div>
          }
        </Col>
      </Row>
    )
  }
}

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice
}))(Header)
