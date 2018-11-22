import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const LinkAddress = styled.div`
  font-weight: 500;
  :hover {
    cursor: copy;
    color: ${primary};
  }
`
