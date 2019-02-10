import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const LastActivity = styled.div`
  color: #000;
  font-size: 0.875rem;
  font-weight: 500;
  color: #d1d1d1;
  opacity: 0;

  :hover {
    color: ${primary} !important;
    text-decoration: underline;
    cursor: pointer;
  }
`
