import React, { Fragment } from 'react'

import { Divider } from 'components/Divider'

import { RowContainer, ItemsContainer, RowTitle } from './styled'
import Item from './Item'
import DefaultTag from './DefaultTag'

export default function({ title, items, onChange, onDelete }) {
  const highlight = items.some(item => item.highlight)

  return (
    <Fragment>
      <RowContainer highlight={highlight}>
        <RowTitle>{title}</RowTitle>
        <ItemsContainer>
          {items.map(tag =>
            tag.type === 'default_tag' ? (
              <DefaultTag key={tag.text} tag={tag} />
            ) : (
              <Item
                onChange={onChange}
                onDelete={onDelete}
                key={tag.text}
                tag={tag}
              />
            )
          )}
        </ItemsContainer>
      </RowContainer>
      <Divider margin="0 auto" width="calc(100% - 3rem)" />
    </Fragment>
  )
}
