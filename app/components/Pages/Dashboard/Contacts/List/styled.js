import styled from 'styled-components'

export const Container = styled.div`
  padding: 0 1.5em;
`

export const ViewMode = styled.div`
  display: ${props => (props.enabled ? 'block' : 'none')};
`
