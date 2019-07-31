import React from 'react'
import PropTypes from 'prop-types'

import Card from 'components/Card'

import { DefaultItem } from './styled'
import { SuggestionItem } from './SuggestionItem'

Suggestions.propTypes = {
  searchText: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onClickDefaultItem: PropTypes.func.isRequired,
  onClickSuggestionItem: PropTypes.func.isRequired,
  style: PropTypes.shape()
}

Suggestions.defaultProps = {
  style: {}
}

export function Suggestions({ items, handleMouseOver, ...props }) {
  const handleMouseEnter = () => handleMouseOver(true)
  const handleMouseLeave = () => handleMouseOver(false)

  return (
    <Card
      style={props.style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
    </Card>
  )
}
