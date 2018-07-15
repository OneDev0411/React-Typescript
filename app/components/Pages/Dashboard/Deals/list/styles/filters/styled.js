import styled from 'styled-components'
import {
  ListItemName as ItemName,
  ListIconContainer as IconContainer
} from '../../../../../../../views/components/Grid/SavedSegments/List/styled'

export const ListItemName = ItemName.extend`
  width: 90%;
`

export const ListIconContainer = IconContainer.extend`
  width: 10%;
`

export const BadgeCounter = styled.span`
  display: inline-block;
  color: #62778c;
  font-size: 12px;
  margin-right: 0px;
  background-color: #ededed;
  font-weight: 400;
  min-width: 20px;
  text-align: center;
  border-radius: 5px;
`
