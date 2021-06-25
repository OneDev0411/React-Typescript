import styled from 'styled-components'

import { CONTAINER_HEIGHT } from './constants'

export const Container = styled.div`
  background: #fff;
  border-radius: 3px;
  width: 50rem;
  height: ${CONTAINER_HEIGHT};
  display: flex;
  justify-content: stretch;
  z-index: 101;
`

export const Name = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  word-break: break-word;
`
