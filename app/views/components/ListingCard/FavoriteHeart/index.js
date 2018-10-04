import React from 'react'
import { connect } from 'react-redux'

import toggleFavorite from '../../../../store_actions/listings/favorites/toggle-favorite'
import { getIsFavorite } from '../../../../reducers/listings/favorites'

class Heart extends React.Component {
  onToggle = () => this.props.dispatch(toggleFavorite(this.props.listing))

  render() {
    const { width = '100%', height = '100%', style } = this.props

    return (
      <img
        alt="favorite heart"
        style={{ width, height, ...style }}
        onClick={this.onToggle}
        src={`/static/images/dashboard/mls/heart${
          this.props.isFavorited ? '-red' : '-white'
        }.svg`}
      />
    )
  }
}

export default connect((state, props) => ({
  isFavorited: getIsFavorite(state.favorites.listings, props.listing.id)
}))(Heart)

// todo: removing static svg
