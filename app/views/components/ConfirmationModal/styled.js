import styled, { css } from 'styled-components'

import { red } from '../../utils/colors'

function isDanger(props) {
  if (props.appearance === 'danger') {
    return css`
      background: ${red.primary};

      &:hover {
        background: ${red.A100};
      }
    `
  }
}

export const ActionBarContainer = styled.div`
  & .modal-confirm {
    ${isDanger}
  }
`
