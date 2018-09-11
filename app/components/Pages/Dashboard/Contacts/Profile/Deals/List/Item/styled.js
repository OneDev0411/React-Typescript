import styled from 'styled-components'

import { getStatusColor } from '../../../../../../../../utils/listing'

import {
  grey,
  brandBackground
} from '../../../../../../../../views/utils/colors'

export const Container = styled.div`
  display: flex;
  margin: 0 -0.5em 0.5em;
  padding: 0.5em;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    cursor: pointer;
    border-radius: 3px;
    background-color: ${brandBackground};
  }
`

export const Price = styled.b`
  margin-right: 1em;
  font-weight: bold;
`

export const Status = styled.span`
  font-size: 0.875rem;
  line-height: 1;
  color: ${props => `#${getStatusColor(props.status)}`};
`

export const Address = styled.div`
  font-size: 0.875rem;
  color: ${grey.A900};
`

export const Role = styled.div`
  font-size: 0.875rem;
  color: ${grey.A900};
  font-weight: 600;
  margin-bottom: 0.5em;
`
