import React from 'react'

import IconButton from 'components/Button/IconButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

import { RowContainer, RowTitle } from './styled'

export default function({ title, items, onChange }) {
  return (
    <RowContainer>
      <RowTitle>{title}</RowTitle>
      {items.map((tag, index) => (
        <IconButton onClick={() => onChange(tag)} key={index}>
          {tag.text}
          <DeleteIcon />
        </IconButton>
      ))}
    </RowContainer>
  )
}
