import React, { Fragment } from 'react'

import { Divider } from 'components/Divider'

import Item from './Item'
import { RowContainer, ItemsContainer, RowTitle } from './styled'

export default function TagsRow({ title, items, onChange, onDelete }) {
  const highlight = items.some(item => item.highlight)

  return (
    <Fragment>
      <RowContainer highlight={highlight}>
        <RowTitle>{title}</RowTitle>
        <ItemsContainer>
          {items.map(tag => (
            <Item
              onChange={onChange}
              onDelete={onDelete}
              key={tag.text}
              tag={tag}
            />
          ))}
        </ItemsContainer>
      </RowContainer>
      <Divider margin="0 auto" width="calc(100% - 3rem)" />
    </Fragment>
  )
}
