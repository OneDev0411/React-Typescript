// Partials/FavoriteHeart.js
import React, { Component } from 'react'
import S from 'shorti'
import controller from '../controller'
export default class FavoriteHeart extends Component {
  isFavorited(mls_number) {
    return controller.listing_card.isFavorited(mls_number)
  }
  render() {
    const listing = this.props.listing
    const mls_number = listing.mls_number
    const heart_style = S('pointer absolute r-20 t-20 w-44 h-40 mr-5 z-2')
    return (
      <img
        onClick={ controller.listing_card.handleFavoriteAction.bind(this, listing) } style={ heart_style }
        src={`/static/images/dashboard/mls/heart${this.isFavorited(mls_number) ? '-red' : '-white'}.svg`}
      />
    )
  }
}
FavoriteHeart.propTypes = {
  listing: React.PropTypes.object
}
