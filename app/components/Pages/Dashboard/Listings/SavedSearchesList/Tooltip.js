import React from 'react'

import TT from '../../../../../views/components/tooltip'
import { grey } from '../../../../../views/utils/colors'

export function Tooltip({ item, children }) {
  return (
    <TT
      captionIsHTML
      isCustom={false}
      placement="right"
      caption={
        <div style={{ textAlign: 'left', padding: '0.5rem 0' }}>
          <div style={{ color: '#fff', fontWeight: 'bold' }}>{item.title}</div>
          <div style={{ color: grey.A300 }}>
            {item.users.map(user => user.first_name).join(', ')}
          </div>
        </div>
      }
    >
      {children}
    </TT>
  )
}
