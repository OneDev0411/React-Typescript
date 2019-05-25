import styled, { css } from 'styled-components'

import { primary } from 'views/utils/colors'

export const TitleContainer = styled.div`
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  padding-right: 0.25rem;

  span {
    color: ${primary};
    margin-left: 0.5rem;
    opacity: 0;
  }

  ${props =>
    props.editable &&
    css`
      :hover {
        cursor: pointer;
        border: 1px dashed ${primary};
      }

      :hover span {
        opacity: 1;
      }
    `}
`

export const AddressInput = styled.input`
  border: 1px solid #d4d4d4;
  border-radius: 3px;
  height: 35px;
  width: 20rem;
  margin-top: 5px;
  padding: 0 5px;
`
