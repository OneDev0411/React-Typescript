import React, { Fragment } from 'react'

import { Divider } from 'components/Divider'

import { RowContainer, RowTitle } from './styled'
import Item from './Item'

export default function({ title, items, highlight, onChange }) {
  return (
    <Fragment>
      <RowContainer highlight={highlight}>
        <RowTitle>{title}</RowTitle>
        {items.map((tag, index) => (
          // <IconButton onClick={() => onChange(tag)} key={index}>
          //   {tag.text}
          //   <DeleteIcon />
          // </IconButton>
          <Item onChange={onChange} key={index} tag={tag} />
        ))}
      </RowContainer>
      <Divider margin="0 auto" width="calc(100% - 3rem)" />
    </Fragment>
  )
}
