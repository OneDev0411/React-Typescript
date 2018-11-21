import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey } from '../../../utils/colors'

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  background-color: ${props =>
    props.isHighlighted ? grey.A100 : 'transparent'};
`

export const ListItemImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%;
`

export const ListItemAddress = styled.div`
  padding-left: 0.5rem;
`

export const ListItemStatus = styled.div`
  text-align: right;
`

export const Status = styled.span`
  color: #fff;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 3px;
  font-weight: 500;
`

export const AddressContainer = styled.div`
  display: flex;
  align-items: center;
`

export const Address = styled.div`
  font-size: 0.875rem;
`

export const IconContainer = styled(Flex)`
  width: 2.5rem;
  height: 2.5rem;
  background-color: #000;
  border-radius: 50%;
  > svg {
    height: 1rem;
    width: 1rem;
  }
`
