import styled from 'styled-components'

import { red, primary } from 'views/utils/colors'

export const Loading = styled.div`
  .sk-circle {
    margin: 0 !important;
    width: 1em !important;
    height: 1em !important;
  }
`

export const EditMls = styled.div`
  color: ${primary};
  margin: 0 0.5rem 0 1.5rem;
  cursor: pointer;
  display: none;
`

export const MlsNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px dashed transparent;
  border-radius: 3px;
  padding: 0.25rem 0.5rem;
  color: ${primary};

  svg {
    display: none;
    transition: 0.2s ease-in opacity;
    cursor: pointer;
    fill: ${red.A100};
  }

  :hover {
    border-color: #0c45e1;
    svg {
      display: block;
      width: 18px;
      height: 18px;
    }

    ${EditMls} {
      display: block;
    }
  }
`
