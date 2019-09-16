import React from 'react'
import { Box } from '@material-ui/core'

import Item from './Item/Item'

interface Props {
  items: TBrandFlow<'steps'>[]
  onStop: (flowId: UUID) => Promise<void>
}

export default function List({ items, onStop }: Props) {
  return (
    <Box mb={2}>
      {items.map(item => (
        <Item key={item.id} flow={item} onStop={onStop} />
      ))}
    </Box>
  )
}
