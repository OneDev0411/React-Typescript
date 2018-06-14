import styled from 'styled-components'

export const Container = styled.div`
  display: inline-block;
  /* position: relative; */
  min-width: 50px;
`

export const LabelButton = styled.button`
  font-size: 14px;
  color: #17283a;
  background: transparent;
  border: none;
  margin-right: 10px;
  font-weight: 400;
  padding: 0 !important;

  &:focus {
    outline: none;
  }

  i {
    margin-left: 5px;
  }
`

export const List = styled.div`
  position: absolute;
  left: 0;
  top: 20px;
  width: 170px;
  min-height: 300px;
  max-height: 370px;
  overflow: auto;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  padding: 16px 0 0 16px;
  z-index: 1;
`

export const ListItem = styled.div`
  color: ${props => (props.isSelected ? '#2196f3' : '#17283a')};
  font-weight: ${props => (props.isSelected ? 500 : 400)};
  margin-bottom: 10px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #2196f3;
  }
`
