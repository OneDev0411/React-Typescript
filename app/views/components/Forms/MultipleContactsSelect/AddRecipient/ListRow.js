import React from 'react'

import TagIcon from 'components/SvgIcons/Tag/TagIcon'
import ListIcon from 'components/SvgIcons/List/ListIcon'

import { IconContainer, RowContainer } from './styled'

export function ListRow({ text, member_count, onClick, type = 'tag' }) {
  const summery =
    member_count && `${member_count} Contact${member_count > 1 ? 's' : ''}`

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
