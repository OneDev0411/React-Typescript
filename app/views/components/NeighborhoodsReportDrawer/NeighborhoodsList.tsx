import React from 'react'
import { List, Typography } from '@material-ui/core'

import { Neighborhood } from './types'
import NeighborhoodsListItem from './NeighborhoodsListItem'

interface Props {
  neighborhoods: Neighborhood[]
  onItemClick: (neighborhood: Neighborhood) => void
}

export default function NeighborhoodsList({
  neighborhoods,
  onItemClick
}: Props) {
  if (neighborhoods.length === 0) {
    return (
      <div>
        <Typography variant="body1">
          No results, please try searching something else.
        </Typography>
      </div>
    )
  }

  return (
    <List>
      {neighborhoods.map(item => (
        <NeighborhoodsListItem
          key={item.id}
          neighborhood={item}
          onClick={onItemClick}
        />
      ))}
    </List>
  )
}
