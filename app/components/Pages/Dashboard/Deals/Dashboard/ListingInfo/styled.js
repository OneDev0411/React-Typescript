import styled, { css } from 'styled-components'

import { primary } from 'views/utils/colors'

export const TitleContainer = styled.div`
  border: 1px solid transparent;

  ${props =>
    props.editable &&
    css`
      :hover {
        cursor: pointer;
        border: 1px dashed ${primary};
      }
    `}
`
