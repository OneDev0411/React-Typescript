import React from 'react'
import PropTypes from 'prop-types'

import { ListContainer, DefaultItem } from './styled'
import { SuggestionItem } from './SuggestionItem'

Suggestions.propTypes = {
  searchText: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onClickDefaultItem: PropTypes.func.isRequired,
  onClickSuggestionItem: PropTypes.func.isRequired
}

export function Suggestions({ items, ...props }) {
  return (
    <ListContainer>
      <DefaultItem onClick={props.onClickDefaultItem}>
        {'Use "'}
        <span className="search-text">{props.searchText}</span>
        {'"'}
      </DefaultItem>
      {items.length > 0 &&
        items.map((item, index) => (
          <SuggestionItem
            key={index}
            item={item}
            onClick={() => props.onClickSuggestionItem(item)}
          />
        ))}
    </ListContainer>
  )
}
