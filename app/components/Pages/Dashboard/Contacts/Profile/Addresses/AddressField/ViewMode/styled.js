import styled from 'styled-components'

import { grey } from 'views/utils/colors'
import StarIcon from 'components/SvgIcons/Star/StarIcon'

export const Label = styled.div`
  display: flex;
  align-items: center;
  color: ${grey.A900};
  margin-bottom: 0.25em;
`

export const Star = styled(StarIcon)`
  width: 1rem;
  height: 1rem;
  fill: #f5a623;
  margin-left: 0.5rem;
`

export const Address = styled.div`
  min-height: 1.5rem;
`
