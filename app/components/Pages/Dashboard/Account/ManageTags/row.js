import React, { Fragment } from 'react'

import IconButton from 'components/Button/IconButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import { Divider } from 'components/Divider'

import { RowContainer, RowTitle } from './styled'

export default function({ title, items, highlight, onChange }) {
  return (
    <Fragment>
      <RowContainer highlight={highlight}>
        <RowTitle>{title}</RowTitle>
        {items.map((tag, index) => (
          <IconButton onClick={() => onChange(tag)} key={index}>
            {tag.text}
            <DeleteIcon />
          </IconButton>
        ))}
      </RowContainer>
      <Divider margin="0 auto" width="calc(100% - 3rem)" />
    </Fragment>
  )
}
