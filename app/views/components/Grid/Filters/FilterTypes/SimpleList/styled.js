import styled from 'styled-components'

import { placeholderColor, error } from 'views/utils/colors'

export const List = styled.div`
  max-height: 18.75rem;
  overflow: auto;
`

export const Placeholder = styled.div`
  color: ${({ hasError }) => (hasError ? error : placeholderColor)};
  text-align: center;
  padding: 0.3rem;
`
