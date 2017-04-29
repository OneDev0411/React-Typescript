import React from 'react'
import { browserHistory } from 'react-router'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import S from 'shorti'
import _ from 'underscore'
import { getFieldValue } from '../../../../../utils/helpers'

export default class DealsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      deals: {}
    }
  }
  componentDidMount() {
    const { user, deals } = this.props

    if (deals)
      this.setState({ deals: deals.list })
  }

  componentWillReceiveProps(nextProps) {
    const { deals } = nextProps

    if (deals && _.size(deals.list) > _.size(this.state.deals))
      this.setState({ deals: deals.list })
  }

  create(type) {
    browserHistory.push(`/dashboard/deals/create/${type}`)
  }

  getPrice(deal) {
    const price = getFieldValue(deal, 'list_price')

    if (!price)
      return '-'

    return '$' + price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  getStatus(deal) {
    return getFieldValue(deal, 'listing_status') || 'Coming Soon'
  }

  getClosingDate(deal) {
    return getFieldValue(deal, 'closing_date')
  }

  getSortOrder(deal) {
    const status = this.getStatus(deal)
    const list = ['Incoming', 'Coming Soon', 'Active', 'Active Option Contract',
      'Active Contingent', 'Active Kick Out', 'Pending', 'Sold', 'Leased', 'Expired',
      'Temp Off Market', 'Cancelled', 'Withdrawn']

    const order = list.indexOf(status)
    return order > -1 ? order : list.length + 1
  }

  getNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  render() {
    const { deals } = this.state

    return (
      <div className="list">

        <Row className="toolbar">
          <Col lg={2} md={2} sm={2} className="vcenter">
            <span className="title">Deals</span>
          </Col>

          <Col lg={4} md={4} sm={4} className="vcenter">
            { _.size(deals) } total
          </Col>

          <Col lg={6} md={6} sm={6} className="vcenter right">
            <Button
              bsStyle="primary"
              onClick={this.create.bind(this, 'listing')}
            >
              New Listing
            </Button>

            <Button
              bsStyle="primary"
              onClick={this.create.bind(this, 'offer')}
            >
              Make an Offer
            </Button>
          </Col>
        </Row>

        {
          _.size(deals) > 0 &&
          <Grid className="table">
            <Row className="header">
              <Col md={4} sm={4} xs={4}>ADDRESS</Col>
              <Col md={2} sm={2} xs={2}>STATUS</Col>
              <Col md={2} sm={2} xs={2}>PRICE $</Col>
              <Col md={2} sm={2} xs={2}>SIDE</Col>
              <Col md={2} sm={2} xs={2}>CLOSING DATE</Col>
            </Row>
            {
              _.chain(deals)
              .sortBy(deal => this.getSortOrder(deal))
              .map(deal => (
                <Row
                  key={`DEAL_${deal.id}`}
                  onClick={
                    () => browserHistory.push(`/dashboard/deals/${deal.id}`)
                  }
                  className={`item type_${this.getStatus(deal)}`}
                >
                  <Col md={4} sm={4} xs={4}>
                    <img
                      style={S('mr-10 w-20')}
                      src={ getFieldValue(deal, 'photo') || '/static/images/deals/home.svg' }
                    />
                    { getFieldValue(deal, 'street_address') }
                  </Col>
                  <Col md={2} sm={2} xs={2}>
                    { this.getStatus(deal, 'listing_status') }
                  </Col>
                  <Col md={2} sm={2} xs={2}>
                    { this.getPrice(deal) }
                  </Col>
                  <Col md={2} sm={2} xs={2}>
                    { getFieldValue(deal, 'deal_type') }
                  </Col>
                  <Col md={2} sm={2} xs={2}>
                    { getFieldValue(deal, 'closing_date') }
                  </Col>
                </Row>
                ))
              .value()
            }
          </Grid>
        }
      </div>
    )
  }
}
