// Widgets/Listings/index.js
import React, { Component } from 'react'

import { ZeroState } from 'partials/ZeroState'

import ListingSection from './Partials/ListingSection'

class ListingsWidget extends Component {
  state = {
    height: window.innerHeight,
    listingsCount: {
      active: 0,
      sold: 0
    },
    noOptionProvided:
      !this.props.location.query.brokerage &&
      !this.props.location.query.agent &&
      !this.props.location.query.brand
  }

  componentDidMount = () => {
    if (this.state.noOptionProvided) {
      console.error('Please provide either brokerage, agent or brand')
    }
  }

  updateListingsCount = (type, length) => {
    this.setState(
      state => {
        let height = state.height
        const listingsCount = {
          ...state.listingsCount,
          [type]: length
        }

        const total = this.getListingsTotalCount()

        if (total === 0) {
          height = 0
        } else {
          height = this.getScrollHeight(height)
        }

        return {
          height,
          listingsCount
        }
      },
      () => this.postHeight(this.state.height)
    )
  }

  getListingsTotalCount = () =>
    Object.values(this.state.listingsCount).reduce((a, b) => a + b, 0)

  postHeight = height => {
    window.parent.postMessage({ height: `${height}px` }, '*')
  }

  getScrollHeight = currentHeight => {
    if (this.parentDiv && this.parentDiv.scrollHeight !== currentHeight) {
      return this.parentDiv.scrollHeight
    }

    return currentHeight
  }

  updateHeight = () => {
    this.setState(
      state => {
        const currentHeight = state.height
        const height = this.getScrollHeight(currentHeight)

        if (currentHeight !== height) {
          return { height }
        }

        return state
      },
      () => this.postHeight(this.state.height)
    )
  }

  render() {
    return (
      <div ref={ref => (this.parentDiv = ref)}>
        {this.state.noOptionProvided ? (
          <ZeroState
            imageUrl="/static/images/zero-state/agents-network.png"
            title="An unexpected error happened!"
            subTitle="For more information, contact the administrator."
          />
        ) : (
          <>
            <ListingSection
              title="Exclusive Listings"
              type="active"
              updateHeight={this.updateHeight}
              updateListingsCount={this.updateListingsCount}
            />
            <div className="clearfix" />
            <ListingSection
              title="Sold"
              type="sold"
              updateHeight={this.updateHeight}
              updateListingsCount={this.updateListingsCount}
            />
          </>
        )}
      </div>
    )
  }
}

export default ListingsWidget
