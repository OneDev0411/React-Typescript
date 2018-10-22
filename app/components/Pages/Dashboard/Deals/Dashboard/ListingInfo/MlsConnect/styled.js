import styled from 'styled-components'

import { red } from 'views/utils/colors'

export const Loading = styled.div`
  .sk-circle {
    margin: 0 !important;
    width: 1em !important;
    height: 1em !important;
  }
`

export const MlsNumber = styled.div`
  display: flex;
  justify-content: space-between;

  svg {
    opacity: 0;
    margin-left: 10px;
    transition: 0.2s ease-in opacity;
    cursor: pointer;
    fill: ${red.A100};
  }

  :hover {
    svg {
      opacity: 1;
    }
  }
`
