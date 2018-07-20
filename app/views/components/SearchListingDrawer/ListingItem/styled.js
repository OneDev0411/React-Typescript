import styled from 'styled-components'

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  background-color: ${props =>
    props.isHighlighted ? '#eff5fa' : 'trasnparent'};
`

export const ListItemImage = styled.img`
  min-width: 45px;
  max-width: 45px;
  min-height: 45px;
  max-height: 45px;
  border-radius: 2px;
`

export const ListItemAddress = styled.div`
  width: 60%;
  padding-left: 10px;
`

export const ListItemStatus = styled.div`
  width: calc(40% - 45px);
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

export const Address = styled.div`
  font-size: 14px;
`
