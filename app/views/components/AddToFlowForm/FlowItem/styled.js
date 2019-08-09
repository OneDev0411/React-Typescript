import styled from 'styled-components'

import { borderColor, green, grey } from 'views/utils/colors'

export const Container = styled.div`
  cursor: pointer;
  padding: 1rem 1.5rem;
  background: ${props => (props.selected ? borderColor : 'transparent')};
  pointer-events: ${props => (props.selected ? 'none' : 'initial')};

  &:hover {
    background: ${grey.A250};
  }

  .active-status {
    width: 0.5em;
    height: 0.5em;
    margin: 0 0.5em 0.5em 0;
    border-radius: 100%;
    background-color: ${green.primary};
  }
`
