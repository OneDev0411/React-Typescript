import React from 'react'
import SvgFilters from '../../../../Partials/Svgs/Filters'

const FilterButton = ({
  onClickHandler = () => {}
}) => (
  <button
    onClick={onClickHandler}
    className="c-mls-toolbar__search-box__filter-btn"
  >
    <SvgFilters color="#929292" />
    <span>Filters</span>
  </button>
)

export default FilterButton