import styled from 'styled-components'

export const ViewModeActionBar = styled.div<{ show: boolean }>`
  position: absolute;
  top: 90%;
  right: 0%;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  display: flex;
  z-index: 1;
`
