import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import { getIsFavorite } from '../../../../../../reducers/listings/favorites'
import toggleFavorite from '../../../../../../store_actions/listings/favorites/toggle-favorite'

const style = {
  cursor: 'pointer'
}

const Heart = ({ isFavorited, onClick, width = '100%', height = '100%' }) => (
  <img
    style={{ ...style, width, height }}
    onClick={onClick}
    alt="toggle favorite"
    src={`/static/images/dashboard/mls/heart${
      isFavorited ? '-red' : '-white'
    }.svg`}
  />
)

const HeartHOC = compose(
  connect(
    ({ favorites }, { listing }) => ({
      isFavorited: getIsFavorite(favorites.listings, listing.id)
    }),
    { toggleFavorite }
  ),
  withHandlers({
    onClick:
      ({ toggleFavorite, listing }) =>
      () => {
        toggleFavorite(listing)
      }
  })
)

export default HeartHOC(Heart)
