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

interface ContentProps {
  noBorder?: boolean
}

export const Content = styled.div<ContentProps>`
  border-radius: 3px;
  background-color: #fff;
  border: ${({ noBorder }) => (noBorder ? 'none' : `1px solid ${borderColor}`)};
  padding: ${({ noBorder }) => (noBorder ? '0' : '1rem')};
`
