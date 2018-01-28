import styled from 'styled-components'

const ShadowButton = styled.button`
  padding: 0;
  font-size: 1em;
  font-weight: 500;
  color: ${props => props.color};
  border-width: 0;
  background: transparent;
`

export default ShadowButton
