import styled from 'styled-components'

export const Container = styled.div`
  padding: ${props => props.theme.spacing(0, 2)};
  overflow: hidden;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing(1)}px;

  button {
    margin-left: ${props => props.theme.spacing(1)}px;
  }
`
