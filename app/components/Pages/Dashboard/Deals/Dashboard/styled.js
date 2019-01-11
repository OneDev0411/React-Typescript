import styled from 'styled-components'

import { borderColor } from 'views/utils/colors'

export const Divider = styled.div`
  display: inline-flex;
  width: 1px;
  height: 1.5rem;
  margin: 0 1em;
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
  background-color: #f2f2f2;
  box-shadow: -1px 0 2px 0 rgba(0, 0, 0, 0.04), -1px 0 20px 0 rgba(0, 0, 0, 0.1);
  padding-bottom: 2.5rem;

  ${props =>
    props.disableScroll &&
    `
    max-height: 100vh;
    overflow: hidden;
  `};
`
