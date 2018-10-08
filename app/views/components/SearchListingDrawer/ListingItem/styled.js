import styled from 'styled-components'
import { grey } from '../../../utils/colors'

import Flex from 'styled-flex-component'

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  cursor: pointer;
  background-color: ${props =>
    props.isHighlighted ? grey.A100 : 'transparent'};
`

export const ListItemImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100%;
`

export const ListItemAddress = styled.div`
  padding-left: 10px;
`

export const ListItemStatus = styled.div`
  text-align: right;
`

export const Status = styled.span`
  display: inline-block;
  color: #fff;
  padding: 0 4px;
  font-size: 12px;
  text-align: center;
  min-width: 60px;
  height: 28px;
  line-height: 28px;
  vertical-align: middle;
  border-radius: 3px;
  font-weight: 500;
`

export const AddressContainer = styled.div`
  display: flex;
  align-items: center;
`

export const Address = styled.div`
  font-size: 14px;
`

export const IconContainer = styled(Flex)`
  width: 40px;
  height: 40px;
  background-color: #000;
  border-radius: 50%;
  > svg {
    height: 16px;
    width: 16px;
  }
`
