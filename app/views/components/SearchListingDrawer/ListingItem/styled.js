import styled from 'styled-components'

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  cursor: pointer;
  background-color: ${props =>
    props.isHighlighted ? '#eff5fa' : 'transparent'};
`

export const ListItemImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 2px;
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
