import React from 'react'

import TT from '../../../../../views/components/tooltip'

export function Tooltip({ item, children }) {
  return (
    <TT
      captionIsHTML
      isCustom={false}
      placement="right"
      caption={
        <div style={{ textAlign: 'left', padding: '8px 0', fontWeight: 500 }}>
          <div style={{ color: '#cecece' }}>{item.title}</div>
          <div style={{ color: '#fff', fontSize: '1.125rem' }}>
            {item.users.map(user => user.first_name).join(', ')}
          </div>
        </div>
      }
    >
      {children}
    </TT>
  )
}
