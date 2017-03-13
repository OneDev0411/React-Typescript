import React from 'react'
import { Link } from 'react-router'
import S from 'shorti'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'
import { addressTitle } from '../../../../../utils/listing'

export default class DealsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deals: []
    }
  }
  componentDidMount() {
    const { user } = this.props
    this.getDeals(user)
  }

  componentWillReceiveProps(nextProps) {
    const { deals } = nextProps

    if (deals)
      this.setState({ deals })
  }

  getDeals(user) {
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
      return deal.context.list_price
    else if (deal.proposed_values)
      return deal.proposed_values.list_price
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

  render() {

    const { deals } = this.state

    return (
      <div>
        {
          deals &&
          <div>
            <h3>Deals</h3>
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
                            {
                              deal.id === '4987a970-c7ab-11e6-abde-0242ac110006' &&
                              <span>***</span>
                            }
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
          </div>
        }
      </div>
    )
  }
}
