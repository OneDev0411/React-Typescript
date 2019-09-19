import styled from 'styled-components'

export const Container = styled.div`
  overflow: hidden;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing(0, 2)};
  margin-bottom: ${props => props.theme.spacing(1)}px;
  border-bottom: 1px solid ${props => props.theme.palette.grey['300']};
`

export const Actions = styled.div`
  button :not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 1px solid ${props => props.theme.palette.primary.dark};
  }

  button :last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  button svg {
    width: 16px;
    height: 16px;
    margin-right: ${props => props.theme.spacing(1)}px;
  }
`
