import styled from 'styled-components'

import { borderColor } from 'views/utils/colors'

export const Divider = styled.div<{ small: boolean }>`
  display: inline-flex;
  width: 1px;
  height: 1.5rem;
  margin: 0 0.825em;
  background-color: ${borderColor};

  ${props =>
    props.small &&
    `
    height: 1rem;
  `}
`

export const PageWrapper = styled.div`
  max-width: 1456px;
  margin: 0 auto;

  /* 1681px */
  @media (min-width: 105.0625em) {
    max-width: 1616px;
  }
`

export const DealContainer = styled.div`
  min-height: 100vh;
`
