import React from 'react'
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@material-ui/core'

import IconMapPinOn from 'components/SvgIcons/MapPinOn/IconMapPinOn'

import { Neighborhood } from './types'

interface Props {
  neighborhood: Neighborhood
  onClick: (neighborhood: Neighborhood) => void
}

export default function NeighborhoodsListItem({
  neighborhood,
  onClick
}: Props) {
  function getFormattedAddress() {
    const {
      address: { zipcode, city, state }
    } = neighborhood

    return `${zipcode}, ${city}, ${state}`
  }

  return (
    <ListItem button onClick={() => onClick(neighborhood)}>
      <ListItemAvatar>
        <Avatar>
          <IconMapPinOn />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={neighborhood.label}
        secondary={getFormattedAddress()}
      />
    </ListItem>
  )
}
