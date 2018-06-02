import React from 'react'

import { Container, ListTitle, ListItem, ListItemName } from './styled'

export const SavedSegments = ({ list }) => (
  <Container>
    <ListTitle>Lists</ListTitle>

    {list.map(item => (
      <ListItem key={item.id} isSelected={item.selected}>
        <ListItemName>{item.title}</ListItemName>
      </ListItem>
    ))}
  </Container>
)
