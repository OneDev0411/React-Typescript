import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  margin: 0 -0.5em;
  padding: 0.5em;

  &:hover {
    cursor: pointer;
    border-radius: ${props => props.theme.shape.borderRadius}px;
    background-color: ${props => props.theme.palette.action.hover};
  }
`

export const Role = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.palette.text.hint};
`
