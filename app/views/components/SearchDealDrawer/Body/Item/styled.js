import styled from 'styled-components'

import { getStatusColor } from 'utils/listing'

export const Details = styled.span`
  font-size: 0.875rem;
  margin-right: 1rem;
  font-weight: 500;
`

export const Status = styled.span`
  line-height: 1;
  color: ${props => `#${getStatusColor(props.status)}`};
`
