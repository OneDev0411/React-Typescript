import React from 'react'
import { connect } from 'react-redux'
import { toggleFilterArea } from '../../../../../../../store_actions/listings/search/filters/toggle-filters-area'

const FilterButton = ({ isOpen, toggleFilterArea, isFetching }) => (
  <button
    disabled={isFetching}
    onClick={toggleFilterArea}
    className={`c-mls-toolbar__search-box__filter-btn ${
      isOpen ? 'is-open' : ''
    }`}
  >
    Filters
    <svg
      fill="#000"
      height="24"
      width="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
      <path d="M0-.75h24v24H0z" fill="none" />
    </svg>
  </button>
)

export default connect(
  ({ search }) => ({
    isOpen: search.filters.isOpen,
    isFetching: search.listings.isFetching
  }),
  {
    toggleFilterArea
  }
)(FilterButton)
