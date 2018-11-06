import styled from 'styled-components'

import IconButton from '../../../../../../views/components/Button/IconButton'

export const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: normal;
  margin: 1rem 0 1rem;
  color: #26465e;
`

export const LastSeen = styled.p`
  margin-bottom: 1em;
  font-size: 1.2rem;
  color: #9eb2c2;
`

export const DeleteButton = styled(IconButton)`
  position: absolute;
  top: 1rem;
  right: 1rem;
`
