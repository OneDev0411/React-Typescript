import styled from 'styled-components'

import { brandBackground, borderColor } from '../../../../../views/utils/colors'

export const PageWrapper = styled.div`
  background-color: ${brandBackground};
`

export const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;

  /* 1681px */
  @media (min-width: 105.0625em) {
    max-width: 1440px;
  }
`

export const Card = styled.div`
  padding: 1.5em;
  margin-bottom: 1em;
  background: #fff;
  border-radius: 3px;
  border: 1px solid ${borderColor};
`

export const ColumnsContainer = styled.div`
  padding: 0 2.5em;

  /* 768px */
  @media (min-width: 48em) {
    display: flex;
  }
`

export const SideColumnWrapper = styled.div`
  overflow: hidden;

  @media (min-width: 48em) {
    width: 30%;
    display: flex;
    flex-direction: column;
  }

  /* 1681px */
  @media (min-width: 105.0625em) {
    width: 25%;
    display: block;
  }
`

export const SecondColumn = styled.div`
  @media (min-width: 48em) {
    width: calc(70% - 1em);
    margin-left: 1em;
  }

  @media (min-width: 105.0625em) {
    margin: 0 1em;
    width: calc(50% - 2em);
  }
`

export const ThirdColumn = styled.div`
  @media (min-width: 105.0625em) {
    width: 25%;
  }
`
