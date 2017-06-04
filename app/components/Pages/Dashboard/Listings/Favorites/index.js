import { connect } from 'react-redux'
import React, { Component } from 'react'
import * as actions from
  '../../../../../store_actions/listings/favorites'
import {
  getFavorites,
  getErrorMessage,
  getIsFetchingStatus
} from
  '../../../../../reducers/listings/favorites'

const FetchError = ({ message, onRetry }) => (
  <div>
    <p>Could not to fetch favorites, {message}</p>
    <button onClick={onRetry}>Retry</button>
  </div>
)

const FavoritesList = ({ list }) => (
  <div style={{ padding: '2rem' }}>
    <h1>Listings Favorites Page</h1>
    <ul style={{ padding: 0 }}>
      {list.map(b => <li key={b.id}>{b.id}</li>)}
    </ul>
  </div>
)

class Favorites extends Component {
  componentDidMount() {
    const {
      favorites,
      isFetching
    } = this.props

    if (!isFetching && !favorites.length) {
      this.fetchData()
    }
  }

  fetchData() {
    const {
      user,
      fetchFavorites
    } = this.props

    fetchFavorites(user)
  }

  render() {
    const {
      favorites,
      isFetching,
      errorMessage
    } = this.props

    if (isFetching && !favorites.length) {
      return <p><b>Loading favorites...</b></p>
    }

    if (errorMessage && !favorites.length) {
      return (
        <FetchError
          message={errorMessage}
          onClick={() => { this.fetchData() }}
        />
      )
    }

    return <FavoritesList list={favorites} />
  }
}

const mapStateToProps = ({
  data,
  favorites
}) => ({
  user: data.user,
  favorites: getFavorites(favorites),
  errorMessage: getErrorMessage(favorites),
  isFetching: getIsFetchingStatus(favorites)
})

export default connect(
  mapStateToProps,
  actions
)(Favorites)
