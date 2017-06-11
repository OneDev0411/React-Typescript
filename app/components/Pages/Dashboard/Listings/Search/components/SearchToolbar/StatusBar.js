import React from 'react'
import { connect } from 'react-redux'
import branch from 'recompose/branch'
import renderNothing from 'recompose/renderNothing'
import { getListingsInfo } from '../../../../../../../reducers/listings'

const emptyStatus = () =>
  () => (
    <p className="c-mls-toolbar__status-bar c-mls-toolbar__status-bar--empty" />
  )

const hideIfNoDataOrFetchings = hasNoData =>
  branch(
    hasNoData,
    emptyStatus
  )

const enhance = hideIfNoDataOrFetchings(
  props => props.isFetching ||
    !(props.count && props.total && props.proposed_title)
)

const StatusBar = enhance(({ isFetching, count, total, proposed_title }) => (
  <p className="c-mls-toolbar__status-bar">
    {`${count} showing of ${total} homes. ${proposed_title}`}
  </p>
))

export default connect(
  ({ search }) => {
    const { listings } = search
    const searchQueryInfo = getListingsInfo(listings)
    return ({
      ...searchQueryInfo,
      isFetching: listings.isFetching
    })
  }
)(StatusBar)