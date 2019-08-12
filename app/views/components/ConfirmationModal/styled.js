import styled, { css } from 'styled-components'

function isDanger(props) {
  if (props.appearance === 'danger') {
    return css`
      background: ${props => props.theme.palette.error.main};

      &:hover {
        background: ${props => props.theme.palette.error.dark};
      }
    `
  }
}

export const ActionBarContainer = styled.div`
  & .modal-confirm {
    ${isDanger}
  }
`
