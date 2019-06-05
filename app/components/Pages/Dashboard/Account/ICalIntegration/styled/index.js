import styled from 'styled-components'

import { borderColor } from 'views/utils/colors'
import { H3 } from 'components/Typography/headings'

export const ICalContainer = styled.div`
  margin-bottom: 2em;
  padding: 0 2em;
`
export const PageDescription = styled.div`
  padding-bottom: 1em;
  margin-bottom: 1em;
  border-bottom: 1px solid ${borderColor};
`

export const Section = styled.div`
  margin-bottom: 3rem;
`

export const Title = styled(H3)`
  font-size: 1.75rem;
  font-weight: 500;
  margin-bottom: 0.5em;
`
