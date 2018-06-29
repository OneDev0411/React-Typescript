import styled from 'styled-components'

export const Container = styled.div``

export const List = styled.div`
  position: absolute;
  width: 300px;
  min-height: 32px;
  max-height: 300px;
  overflow: auto;
  border-radius: 5px;
  background-color: #fff
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
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
  color: #2196f3;
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
    background-color: #2196f3;
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
  border: 1px solid #dbdbdb;
  height: 20px;
  min-width: 40px;
  margin: 0 4px 0 4px;
  text-align: center;
  color: #ccc;
  font-size: 14px;
  border-radius: 2px;
  padding: 0 3px;

  &:hover {
    background-color: red;
    border: none;
    color: #fff;
  }
`

export const ItemsContainer = styled.div`
  background-color: #f8fafb;
  border-radius: 3px;
`

export const InputContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  border: solid 1px #d4dfe6;
  min-height: 40px;
  background-color: #f8fafb;
  cursor: pointer;
  margin: ${props => (props.withMargin ? '2px 4px' : '0')};
`

export const Input = styled.input`
  width: 100%;
  height: 39px;
  padding: 0 30px 0 10px;
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
  color: #7b91a6;
`
