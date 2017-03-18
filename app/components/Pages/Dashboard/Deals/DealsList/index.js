import React from 'react'
import { Link } from 'react-router'
import S from 'shorti'
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
    const { deals } = nextProps

    if (deals)
      this.setState({ deals, loading: false })
  }

  getDeals(user) {
    this.setState({ loading: true })

    AppDispatcher.dispatch({
      action: 'get-deals',
      user
    })
  }

  getDealAddress(deal) {
    if (deal.context.address)
      return deal.context.address
    else if (deal.proposed_values)
      return deal.proposed_values.full_address
    else
      return '-'
  }

  getPrice(deal) {
    if (deal.context.list_price)
      return this.getNumberWithCommas(deal.context.list_price)
    else if (deal.proposed_values)
      return this.getNumberWithCommas(deal.proposed_values.list_price)
    else
      return '-'
  }

  getType(deal) {
    if (deal.context.transaction_type)
      return deal.context.transaction_type
    else if (deal.proposed_values)
      return deal.proposed_values.transaction_type
    else
      return '-'
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
                deals.map(deal => {
                  return (
                    <tr key={`DEAL_${deal.id}`}>
                      <td>
                        <Link to={`/dashboard/deals/${deal.id}`}>
                          <img style={ S('mr-10') } src="/static/images/deals/home.svg" />
                          { this.getDealAddress(deal) }
                        </Link>
                      </td>
                      <td>-</td>
                      <td>{ this.getPrice(deal) } </td>
                      <td>{ deal.context.deal_type }</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        }
      </div>
    )
  }
}
