import React from 'react'
import { Link } from 'react-router'
import S from 'shorti'
import _ from 'underscore'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'
import { addressTitle } from '../../../../../utils/listing'

export default class DealsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deals: [],
      loading: false
    }
  }
  componentDidMount() {
    const { user, deals } = this.props

    if (deals)
      this.setState({ deals })
    else
      this.getDeals(user)
  }

  componentWillReceiveProps(nextProps) {
    const { deals, forms } = nextProps

    if (deals)
      this.setState({ deals, loading: false })

    // load all forms list
    if (!forms)
      this.getForms()
  }

  shouldComponentUpdate(nextProps, nextState) {

    if (nextState.deals.length > 0 && this.state.deals.length === nextState.deals.length)
      return false

    return (
      ( nextState.deals.length > 0 && nextState.loading === false ) ||
      ( nextState.deals.length === 0 && nextState.loading === true )
    )
  }

  getDeals(user) {
    this.setState({ loading: true })

    AppDispatcher.dispatch({
      action: 'get-deals',
      user
    })
  }

  getForms() {
    AppDispatcher.dispatch({
      action: 'get-deal-forms',
      user: this.props.user,
    })
  }

  getDealAddress(deal) {
    const address = this.getValue(deal, 'street_address')

    if (address.endsWith(','))
      return address.substring(0, address.length - 1)
    else
      return address
  }

  getPrice(deal) {
    const price = this.getValue(deal, 'list_price')
    return this.getNumberWithCommas(price)
  }

  getValue(deal, field) {
    if (deal.context && deal.context[field])
      return deal.context[field]
    else if (deal.proposed_values && deal.proposed_values[field])
      return deal.proposed_values[field]

    return '-'
  }

  getCoverImage(deal) {
    let src = '/static/images/deals/home.svg'

    if (deal.listing)
      src = deal.listing.cover_image_url

    return <img style={ S('mr-10 w-20') } src={ src } />
  }

  getStatus(deal) {
    if (deal.listing)
      return deal.listing.status

    return 'Coming Soon'
  }

  getSortOrder(deal) {
    const status = this.getStatus(deal)
    const list = [ 'Incoming', 'Coming Soon', 'Active', 'Active Option Contract',
      'Active Contingent', 'Active Kick Out', 'Pending', 'Sold', 'Leased', 'Expired',
      'Temp Off Market', 'Cancelled', 'Withdrawn' ]

    const order = list.indexOf(status)
    return order > -1 ? order : list.length + 1
  }

  getNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  render() {
    const { deals, loading } = this.state

    return (
      <div className="deals-list">
        <h3>Deals</h3>

        {
          loading &&
          <div className="loading">
            <i className="fa fa-spinner fa-spin fa-2x fa-fw"></i>
            <b>Loading deals ...</b>
          </div>
        }

        {
          deals.length > 0 &&
          <table>
            <thead>
              <tr>
                <td>ADDRESS</td>
                <td>STATUS</td>
                <td>PRICE $</td>
                <td>SIDE</td>
                <td>EXP. DATE</td>
                <td>CLOSING DATE</td>
              </tr>
            </thead>
            <tbody>
              {
                _.chain(deals)
                .sortBy(deal => {
                  return this.getSortOrder(deal)
                })
                .map(deal => {
                  return (
                    <tr key={`DEAL_${deal.id}`}>
                      <td>
                        <Link to={`/dashboard/deals/${deal.id}`}>
                          { this.getCoverImage(deal) }
                          { this.getDealAddress(deal) }
                        </Link>
                      </td>
                      <td>{ this.getStatus(deal) }</td>
                      <td>{ this.getPrice(deal) } </td>
                      <td>{ this.getValue(deal, 'deal_type') }</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  )
                })
                .value()
              }
            </tbody>
          </table>
        }
      </div>
    )
  }
}
