import React from 'react'
import { browserHistory } from 'react-router'
import { Button } from 'react-bootstrap'
import _ from 'underscore'
import Deal from '../../../../../models/Deal'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  onClickDeal(e, id) {
    if (e.target.type === 'checkbox')
      return false

    browserHistory.push(`/dashboard/deal/${id}`)
  }

  create(type) {
    browserHistory.push(`/dashboard/deal/create/${type}`)
  }

  getListingPhoto(deal) {
    const photo = Deal.get.field(deal, 'photo')
    return photo ? photo : '/static/images/deals/home.svg'
  }

  getPrice(deal) {
    const price = Deal.get.field(deal, 'list_price')
    if (!price) {
      return ''
    }

    return price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  getStatus(deal) {
    return Deal.get.field(deal, 'listing_status')
  }

  getSide(deal) {
    return Deal.get.field(deal, 'deal_type')
  }

  render() {
    const { deals } = this.props
    console.log(deals)
    return (
      <div className="deals-list">

        <div className="heading">
          <input
            className="search"
            type="text"
            placeholder="Type in to search ..."
          />

          <Button
            bsStyle="primary"
            onClick={() => this.create('listing')}
          >
            New Listing
          </Button>

          <Button
            bsStyle="primary"
            onClick={() => this.create('offer')}
          >
            Make an Offer
          </Button>
        </div>

        <div className="table-container">
          <table className="table table-hover">
            <tbody>
              <tr className="header">
                <td>ADDRESS</td>
                <td>STATUS</td>
                <td>PRICE</td>
                <td>SIDE</td>
                <td>NEXT DATES</td>
                <td>OUTSTANDING</td>
              </tr>

              {
                _.map(deals, deal => (
                  <tr
                    key={`deal_${deal.id}`}
                    className="item"
                    onClick={e => this.onClickDeal(e, deal.id)}
                  >
                    <td className="address">
                      <img src={this.getListingPhoto(deal)} />
                      {Deal.get.address(deal)}
                    </td>
                    <td>{this.getStatus(deal)}</td>
                    <td>{this.getPrice(deal)}</td>
                    <td>{this.getSide(deal)}</td>
                    <td>----</td>
                    <td>----</td>
                    <td>-</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
