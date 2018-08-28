import styled from 'styled-components'

import { blue, grey } from '../../../../../../utils/colors'
import Card from '../../../../../Card'

export const List = Card.extend`
  position: absolute;
  top: calc(100% + 8px);
  overflow: auto;
  left: 0;
  width: 300px;
  min-height: 32px;
  max-height: 300px;
  z-index: 1001;
`

export const ListItemTitle = styled.div`
  width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ListItemIconContainer = styled.div`
  width: 5%;
  text-align: right;
  color: ${blue.A100};
`

export const ListItem = styled.div`
  display: flex;
  width: 100%;
  height: 32px;
  line-height: 32px;
  vertical-align: middle;
  padding: 0 16px;
  color: #262626;
  font-size: 16px;
  cursor: pointer;
  font-weight: ${props => (props.isSelected ? 500 : 400)};

  :hover {
    background-color: ${blue.A100};
    color: #fff;
  }

  :hover ${ListItemIconContainer} {
    color: #fff;
  }
`

export const SelectedItem = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  margin: 0 4px 0 4px;
  padding: 0 4px;
  font-size: 14px;
  line-height: 24px;
  border-radius: 3px;
  color: #fff;
  background-color: ${blue.A100};

  &:hover {
    background-color: ${blue.A200};
  }
`

export const ItemsContainer = styled.div`
  padding: ${props => (props.selectedItems.length > 0 ? '0.5em' : 0)};
  border-radius: 3px;
  background-color: ${grey.A200};
`

export const InputContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  border: solid 1px ${grey.A300};
  min-height: 40px;
  cursor: pointer;
  margin: ${props => (props.withMargin ? '2px 4px' : '0')};
`

export const Input = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 32px 0 8px;
  border: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

export const InputIndicator = styled.i`
  position: absolute;
  right: 10px;
  top: 12px;
  color: #000;
`
