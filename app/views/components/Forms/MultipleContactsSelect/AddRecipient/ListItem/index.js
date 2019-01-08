import React from 'react'

import TagIcon from 'components/SvgIcons/Tag/TagIcon'
import ListIcon from 'components/SvgIcons/List/ListIcon'

import { IconContainer, RowContainer } from '../styled'

export function ListItem({ text, membersCount, onClick, type = 'tag' }) {
  const summery =
    membersCount && `${membersCount} Contact${membersCount > 1 ? 's' : ''}`

  return (
    <RowContainer onClick={onClick}>
      <IconContainer center>
        {type === 'tag' ? <TagIcon /> : <ListIcon />}
      </IconContainer>

      <div style={{ paddingLeft: '1em' }}>
        <div style={{ lineHeight: 1 }}>{text}</div>
        {summery && <div style={{ color: '#7f7f7f' }}>{summery}</div>}
      </div>
    </RowContainer>
  )
}
