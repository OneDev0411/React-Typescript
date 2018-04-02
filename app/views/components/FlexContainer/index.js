import styled from 'styled-components'

export default styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: ${props => (props.fullHeight ? '100vh' : 'auto')};
  justify-content: ${props => (props.center ? 'center' : 'initial')};
`
