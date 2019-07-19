import styled from 'styled-components'

import { borderColor } from 'views/utils/colors'

export const Container = styled.div`
  cursor: pointer;
  padding: 1rem 1.5rem;
  background: ${props => (props.selected ? borderColor : 'transparent')};
  pointer-events: ${props => (props.selected ? 'none' : 'initial')};

  &:hover {
    background: ${borderColor};
  }
`
