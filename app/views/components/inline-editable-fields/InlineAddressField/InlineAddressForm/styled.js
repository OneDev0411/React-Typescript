import styled from 'styled-components'

import Card from 'components/Card'
import { grey } from 'views/utils/colors'

export const Container = styled(Card)`
  width: 100%;
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 2;

  @media screen and (min-width: 48em) {
    width: 36rem;
  }

  @media screen and (min-width: 60em) {
    width: 45rem;
  }
`

export const Body = styled.div`
  padding: 1.5rem 1rem 0;
  background-color: #fff;

  @media screen and (min-width: 48em) {
    padding: 1.5rem 1.5rem 0;
  }
`

export const Row = styled.div`
  @media screen and (min-width: 48em) {
    display: flex;
  }
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: ${grey.A100};

  @media screen and (min-width: 48em) {
    padding: 0.5rem 1.5rem;
  }
`
