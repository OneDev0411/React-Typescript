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
  border-bottom: 1px solid #eff1f2; // TODO: add this color to the theme
`

export const Actions = styled.div`
  button :not(:last-child) {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-right: 1px solid ${props => props.theme.palette.primary.dark};
  }

  button :last-child {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  button svg {
    width: 1rem;
    height: 1rem;
    margin-right: ${props => props.theme.spacing(1)}px;
  }
`
