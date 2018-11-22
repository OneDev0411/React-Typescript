import React from 'react'

import { basePath } from '../data'
import { Placeholder } from './styled'

export function Shortcut({ item }) {
  const { is_coming_soon, name } = item
  const file = is_coming_soon ? `${name}.svg` : `${name}@3x.jpg`

  return (
    <div>
      <Placeholder center>
        <img src={`${basePath}/${name}/${file}`} alt={name} />
      </Placeholder>
      <div style={{ textAlign: 'center', fontWeight: 500 }}>{item.title}</div>
    </div>
  )
}
