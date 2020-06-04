import styled from 'styled-components'

import { grey, blue } from 'views/utils/colors'

export const DropDownContainer = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
`

export const DropDownMenu = styled.div`
  position: absolute;
  z-index: 1000;
  overflow: auto;
  overflow-x: hidden;
  background: #fff;
  padding: 0;
  width: 100%;
  border: none;
  border-radius: 4px;
  max-height: 250px;
  border: 1px solid #eee;
  min-width: 375px;

  ${props =>
    props.pullRight &&
    `
    right: 0;
  `};
`

export const ChecklistTitle = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  background-color: ${grey.A100};
  font-weight: 600;
  padding: 0 11px;
`

export const ChecklistItemTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  padding-right: 10px;
  color: ${props =>
    props.selected
      ? props.theme.palette.secondary.main
      : props.theme.palette.common.black};
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
  width: ${props => (props.fullWidth ? '100%' : '75%')};
`

export const ChecklistItemNotifyOffice = styled.div`
  width: 30%;
  margin-top: 5px;
  opacity: ${props => (props.isSelected ? 1 : 0)};
`

export const ChecklistItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  padding: 0 15px 0 11px;
  border-bottom: 1px solid #e9e9e9;
  cursor: pointer;

  &:hover ${ChecklistItemNotifyOffice} {
    opacity: 1;
  }

  &:hover ${ChecklistItemTitle} {
    color: ${blue.A200};
  }
`

export const ChecklistNewItemInputContainer = styled.div`
  position: relative;
`

export const ChecklistNewItemInput = styled.input`
  border-radius: 3px;
  width: 100% !important;
  height: 30px;
  background-color: #ffffff;
  border: solid 1px #d4dfe6;
  padding: 2px 10% 2px 5px;

  &:focus {
    outline: 0;
  }
`

export const ChecklistNewItemCancel = styled.span`
  position: absolute;
  right: 10px;
  top: 5px;
  font-weight: 400;
  color: #0945eb;
`

export const ChecklistNewItemSave = styled.span`
  position: absolute;
  right: 25px;
  top: 5px;
  font-weight: 400;
  color: #0945eb;
`
