import React from 'react'
import pure from 'recompose/pure'

import { Container, Placeholder, Title, Anchor } from './styled'

const baseURL = '/dashboard/marketing/'
const imgBasePath = '/static/images/marketing/store/shortcuts'

function Shortcut({ item }) {
  const { url, name } = item
  const file = url ? `${name}@3x.png` : `${name}.svg`

  return (
    <Container className={url ? 'c-shortcut--active' : ''}>
      <Placeholder center>
        <img {...item.size} src={`${imgBasePath}/${name}/${file}`} alt={name} />
      </Placeholder>
      <Title>{item.title}</Title>
      {url && <Anchor to={`${baseURL}${url}`} />}
    </Container>
  )
}

export default pure(Shortcut)
