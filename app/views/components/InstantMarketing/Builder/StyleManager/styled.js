import styled from 'styled-components'

import { borderColor } from 'views/utils/colors'

export const Container = styled.div`
  padding: 1rem;
  > div:not(:empty) {
    border: 1px solid ${borderColor};
    border-radius: 3px;
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
  }
`

export const ItemTitle = styled.p`
  width: 100%;
  font-size: 1rem;
  text-align: left;
  color: #000;
`

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`
