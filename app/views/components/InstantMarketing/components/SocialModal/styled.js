import styled from 'styled-components'

import { H3 } from 'components/Typography/headings'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .sk-circle {
    margin: 0 !important;
  }
`

export const Heading = styled(H3)`
  color: #d4d4d4;
  margin-bottom: 1rem;
`
