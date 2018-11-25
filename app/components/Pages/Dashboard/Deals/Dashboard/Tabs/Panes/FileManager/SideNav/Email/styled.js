import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const Container = styled.div`
  text-align: center;
`

export const Text = styled.p`
  color: #808080;
  font-size: 0.875rem;
  margin: 0.8rem 0;
`

export const EmailLink = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.43;
  color: ${primary};
  cursor: pointer;
`
