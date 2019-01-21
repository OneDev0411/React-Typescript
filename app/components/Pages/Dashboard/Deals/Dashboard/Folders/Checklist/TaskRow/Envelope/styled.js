import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const Container = styled.div`
  cursor: pointer;

  :hover {
    color: ${primary};
    text-decoration: underline;
  }
`
