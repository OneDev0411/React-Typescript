import React from 'react'
import { browserHistory } from 'react-router'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import S from 'shorti'

const styles = {
  title: {
    fontSize: '31px',
    fontWeight: 300,
    lineHeight: 1,
    color: '#5e676c'
  }
}

const getFieldValue = (deal, field) => {
  if (deal.context && deal.context[field])
    return deal.context[field]
  else if (deal.proposed_values && deal.proposed_values[field])
    return deal.proposed_values[field]

  return '-'
}

const getSortedDeals = (deals) => {
  // temporary array holds objects with position and sort-value
  const mapped = deals.map((deal, index) => ({
    index,
    review: deal.reviews ? deal.reviews.length : 0
  }))

  // sorting the mapped array containing the reduced values
  mapped.sort((a, b) => (a.review > b.review))

  // container for the resulting order
  return mapped.map(el => deals[el.index])
}

export default class DealsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      deals: []
    }
  }

  componentDidMount() {
    const { conciergeDeals } = this.props

    if (conciergeDeals) {
      this.setState({
        deals: conciergeDeals
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { conciergeDeals } = nextProps

    if (conciergeDeals && conciergeDeals.length > this.state.deals.length) {
      this.setState({
        deals: conciergeDeals
      })
    }
  }

  getDealAddress(deal) {
    const address = getFieldValue(deal, 'full_address')

    if (address.endsWith(','))
      return address.substring(0, address.length - 1)
    return address
  }

  getCoverImage(deal) {
    let src = '/static/images/deals/home.svg'

    if (deal.listing)
      src = deal.listing.cover_image_url

    return <img style={S('mr-10 w-20')} src={src} />
  }

  getReview(deal) {
    if (!deal.reviews)
      return null

    const pendingReviews =
      deal.reviews.filter(review => review.state === 'Pending')

    if (pendingReviews.length) {
      return (
        <span
          style={{
            color: '#f5a623',
            fontSize: '15px',
            lineHeight: 1,
            textAlign: 'right'
          }}
        >
          <svg
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              marginRight: '10px'
            }}
            width="17"height="20"viewBox="0 0 17 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="#F6A623"fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round"><path d="M16.397 17.5H3.474V.5h7.953l4.97 5z" /><path d="M14.41 17.5v2H1.484v-17h1.99m7.953-2v5h4.97" /></g>
          </svg>
          {`REVIEW(${pendingReviews.length})`}
        </span>
      )
    }

    return null
  }

  // getSortOrder(deal) {
  //   const status = this.getStatus(deal)
  //   const list = ['Incoming', 'Coming Soon', 'Active', 'Active Option Contract',
  //     'Active Contingent', 'Active Kick Out', 'Pending', 'Sold', 'Leased', 'Expired',
  //     'Temp Off Market', 'Cancelled', 'Withdrawn']

  //   const order = list.indexOf(status)
  //   return order > -1 ? order : list.length + 1
  // }

  render() {
    const { deals } = this.state

    return (
      <div className="list">

        <Row className="toolbar">
          <Col lg={2} md={2} sm={2} className="vcenter">
            <span style={styles.title}>Deals</span>
          </Col>

          <Col lg={10} md={10} sm={10} className="vcenter">
            { deals.length } total
          </Col>
        </Row>

        {
          deals.length > 0 &&
          <Grid className="table">
            <Row className="header">
              <Col md={6} sm={6} xs={6}>ADDRESS</Col>
              <Col md={2} sm={2} xs={2}>AGENT NAME</Col>
              <Col md={1} sm={1} xs={1}>SIDE</Col>
              <Col md={3} sm={3} xs={3}>CLOSING DATE</Col>
            </Row>
            {
              getSortedDeals(deals).reverse().map(deal => (
                <Row
                  key={`DEAL_${deal.id}`}
                  onClick={() => browserHistory.push(`/dashboard/concierge/deals/${deal.id}`)}
                  className={'item'}
                >
                  <Col md={6} sm={6} xs={6}>
                    { this.getCoverImage(deal) }
                    <span>{ this.getDealAddress(deal) }</span>
                  </Col>
                  <Col md={2} sm={2} xs={2}>
                    <span>{ deal.created_by.display_name || '-' }</span>
                  </Col>
                  <Col md={1} sm={1} xs={1}>
                    <span>{ deal.context.deal_type || '-' }</span>
                  </Col>
                  <Col
                    md={3} sm={3} xs={3}
                    style={{
                      position: 'relative'
                    }}
                  >
                    <span>{ deal.context.closing_date || '-' }</span>
                    <span
                      style={{
                        width: '102px',
                        position: 'absolute',
                        right: '15px'
                      }}
                    >
                      { this.getReview(deal) || '' }
                    </span>
                  </Col>
                </Row>
              ))
            }
          </Grid>
        }
      </div>
    )
  }
}
