import styled from 'styled-components'

import Card from 'components/Card'

export const Container = styled(Card)`
  width: 44rem;
  height: 30rem;
  position: absolute;
  top: calc(100% + 0.5rem);
  left: ${props => (props.alignRight ? 'auto' : 0)};
  right: ${props => (props.alignRight ? 0 : 'auto')};
  display: flex;
  justify-content: stretch;
  z-index: 101;
`

export const Name = styled.div`
  font-weight: 600;
  margin-bottom: 0.5em;
`
