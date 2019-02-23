import React, { Fragment } from 'react'

import { Divider } from 'components/Divider'

import { RowContainer, ItemsContainer, RowTitle } from './styled'
import Item from './Item'

export default function({ title, items, onChange, onDelete }) {
  return (
    <Fragment>
      <RowContainer>
        <RowTitle>{title}</RowTitle>
        <ItemsContainer>
          {items.map((tag, index) => (
            <Item
              onChange={onChange}
              onDelete={onDelete}
              key={index}
              tag={tag}
            />
          ))}
        </ItemsContainer>
      </RowContainer>
      <Divider margin="0 auto" width="calc(100% - 3rem)" />
    </Fragment>
  )
}
