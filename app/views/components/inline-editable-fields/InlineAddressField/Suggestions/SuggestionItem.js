import React from 'react'
import PropTypes from 'prop-types'

import { Item } from './styled'

SuggestionItem.propTypes = {
  item: PropTypes.shape().isRequired,
  onClick: PropTypes.func.isRequired
}

export function SuggestionItem({ item, onClick }) {
  return (
    <Item onClick={onClick}>
      <span className="item__query">
        <span className="item__matched">
          {item.matched_substrings
            .map(s =>
              item.structured_formatting.main_text.substr(s.offset, s.length)
            )
            .join('')}
        </span>
        {item.structured_formatting.main_text.substr(
          item.matched_substrings[item.matched_substrings.length - 1].offset +
            item.matched_substrings[item.matched_substrings.length - 1].length,
          item.structured_formatting.main_text.length - 1
        )}
      </span>
      <span>{item.structured_formatting.secondary_text}</span>
    </Item>
  )
}
