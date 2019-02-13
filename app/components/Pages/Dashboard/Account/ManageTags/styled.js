import styled from 'styled-components'

import { grey } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1.5rem;
`

export const Description = styled.h2`
  font-size: 1rem;
  font-weight: normal;
  color: #4a4a4a;
`

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${grey.A300};
`

export const RowTitle = styled.h6`
  color: ${grey.A900};
  font-size: 1rem;
  line-height: 1.5rem;
`
