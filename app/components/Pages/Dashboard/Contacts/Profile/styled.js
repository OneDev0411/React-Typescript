import styled from 'styled-components'

import { brandBackground } from '../../../../../views/utils/colors'

export const PageWrapper = styled.div`
  background-color: ${brandBackground};
`

export const PageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 0 0 1.5rem;

  /* 1024px */
  @media (min-width: 64em) {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }
`

export const SideColumn = styled.div`
  @media (min-width: 64em) {
    width: 30%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
`

export const MainColumn = styled.div`
  background-color: #fff;

  @media (min-width: 64em) {
    overflow-x: hidden;
    overflow-y: auto;
    width: 70%;
  }
`

export const Card = styled.div`
  margin-bottom: 1em;
`
