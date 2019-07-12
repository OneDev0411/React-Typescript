import styled from 'styled-components'

import { grey } from 'views/utils/colors'

export const ItemTitle = styled.div`
  font-size: 1rem;
`

export const ItemDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => (props.isActive ? grey.A000 : grey.A900)};
`
