import React from 'react'
import { browserHistory } from 'react-router'
import _ from 'underscore'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  getAddress(deal) {
    const c = deal.context
    return c.street_name + ' ' + c.street_address
  }

  onClickDeal(e, id) {
    if (e.target.type === 'checkbox')
      return false

    browserHistory.push(`/dashboard/deals/${id}`)
  }

  render() {
    const { deals } = this.props
    console.log(deals)
    return (
      <div className="deals-list">

        <table className="table table-hover">
          <tbody>
            <tr className="header">
              <td><input type="checkbox" /></td>
              <td>ADDRESS</td>
              <td>OFFICE</td>
              <td>AGENT NAME</td>
              <td>STATUS</td>
              <td>-</td>
            </tr>

            {
              _.map(deals, deal => (
                <tr
                  key={`deal_${deal.id}`}
                  className="item"
                  onClick={e => this.onClickDeal(e, deal.id)}
                >
                  <td><input type="checkbox" /></td>
                  <td>{ this.getAddress(deal) }</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}
