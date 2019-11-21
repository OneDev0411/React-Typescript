import styled from 'styled-components'

import { borderColor } from 'views/utils/colors'
import { H3 } from 'components/Typography/headings'

export const Container = styled.div`
  margin-bottom: 2em;
`

export const Title = styled(H3)`
  margin-bottom: 0.75em;
`

export const Card = styled.div`
  margin-bottom: 1em;
  background-color: #fff;
  border: solid 1px ${borderColor};
`
