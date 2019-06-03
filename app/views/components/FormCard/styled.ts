import styled from 'styled-components'

import { borderColor } from 'views/utils/colors'

export const Container = styled.div`
  margin-bottom: 4rem;
  padding: 0 1rem;

  @media screen and (min-width: 64rem) {
    max-width: 35rem;
    margin-right: auto;
    margin-left: auto;
  }
`

export const Title = styled.h3`
  font-size: 1.25rem;
  line-height: 1;
  margin: 0 0 0.5rem;
`

export const Content = styled.div`
  padding: 1rem;
  border-radius: 3px;
  background-color: #fff;
  border: 1px solid ${borderColor};
`
