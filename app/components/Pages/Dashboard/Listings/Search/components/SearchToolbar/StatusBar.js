import React from 'react'
import { connect } from 'react-redux'
import branch from 'recompose/branch'
import compose from 'recompose/compose'
import { getListingsInfo } from '../../../../../../../reducers/listings'

const emptyStatus = () => () =>
  <p className="c-mls-toolbar__status-bar c-mls-toolbar__status-bar--empty">
    No listings found
  </p>

const loadingStatus = () => () =>
  <p className="c-mls-toolbar__status-bar">
    Searching...
  </p>

const hideIfNoDataOrFetchings = hasNoData => branch(hasNoData, emptyStatus)

const hideIfIsFetchings = hasNoData => branch(hasNoData, loadingStatus)

const enhance = compose(
  hideIfNoDataOrFetchings(
    props => !((props.count && props.total) || props.proposed_title)
  ),
  hideIfIsFetchings(props => props.isFetching)
)

const StatusBar = enhance(({ isFetching, count, total, proposed_title }) =>
  <p className="c-mls-toolbar__status-bar">
    {`${count} showing of ${total} homes. ${proposed_title}`}
  </p>
)

export default connect(({ search }) => {
  const { listings } = search
  const searchQueryInfo = getListingsInfo(listings)
  return {
    ...searchQueryInfo,
    isFetching: listings.isFetching
  }
})(StatusBar)
