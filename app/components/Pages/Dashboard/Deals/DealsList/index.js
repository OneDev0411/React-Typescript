import React from 'react'
import { browserHistory } from 'react-router'
import S from 'shorti'
import _ from 'underscore'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'
import { addressTitle } from '../../../../../utils/listing'

export default class DealsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deals: [],
      loading: true
    }
  }
  componentDidMount() {
    const { user, deals } = this.props

    if (deals)
      this.setState({ deals })
  }

  componentWillReceiveProps(nextProps) {
    const { deals, forms } = nextProps

    if (deals && this.state.deals.length === 0)
      this.setState({ deals, loading: false })

    // load all forms list
    if (!forms)
      this.getForms()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
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

  getClosingDate(deal) {
    return this.getValue(deal, 'closing_date')
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
          deals.length > 0 &&
          <table>
            <thead>
              <tr>
                <td>ADDRESS</td>
                <td>STATUS</td>
                <td>PRICE $</td>
                <td>SIDE</td>
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
                    <tr
                      key={`DEAL_${deal.id}`}
                      onClick={() => browserHistory.push(`/dashboard/deals/${deal.id}`) }
                    >
                      <td>
                        { this.getCoverImage(deal) }
                        { this.getDealAddress(deal) }
                      </td>
                      <td>{ this.getStatus(deal) }</td>
                      <td>{ this.getPrice(deal) } </td>
                      <td>{ this.getValue(deal, 'deal_type') }</td>
                      <td>{ this.getClosingDate(deal) }</td>
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
