import styled from 'styled-components'

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
`

export const ChecklistTitle = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #f8fafb;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #1d364b;
  padding: 0 11px;
`

export const ChecklistItemTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  padding-right: 10px;
  color: ${props => props.color || '#1d364b'};
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
  width: ${props => (props.fullWidth ? '100%' : '75%')};
`

export const ChecklistItemNotifyOffice = styled.div`
  width: 25%;
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

  &:hover {
    background-color: #f0f4f7;
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
  color: #2196f3;
`
