import styled from 'styled-components'

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 14px;
`

export const ItemTitle = styled.div`
  font-weight: 500;
  width: 95%;
  color: #262626;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const IconContainer = styled.div`
  width: 5%;
`

export const RemoveIcon = styled.i`
  color: #7b91a6;
  display: none;
  margin-top: -2px;
`

export const Container = styled.div`
  position: relative;
  min-width: 152px;
  height: 32px;
  line-height: 32px;
  vertical-align: middle;
  border-radius: 3px;
  background-color: ${props => (props.isActive ? '#fff' : '#dce5eb')};
  border: solid 1px ${props => (props.isActive ? '#2196f3' : '#d4dfe6')};
  margin: 0 5px 5px 0;
  cursor: pointer;

  ${ItemTitle} {
    color: ${props => (props.isActive ? '#2196f3' : '#262626')};
  }

  ${RemoveIcon} {
    display: ${props => (props.isActive ? 'block' : 'none')};
  }

  &:hover {
    background-color: #fff;
    border: solid 1px #2196f3;
  }

  &:hover ${ItemTitle} {
    color: #2196f3;
  }

  &:hover ${RemoveIcon} {
    display: block;
  }
`

export const Menu = styled.div`
  position: absolute;
  z-index: 1000;
  width: 280px;
  min-height: 190px;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
`

export const Content = styled.div`
  min-height: 150px;
  cursor: auto;
`

export const Button = styled.button`
  width: 100%;
  height: 40px;
  line-height: 40px;
  vertical-align: middle;
  background-color: #ffffff;
  border: none;
  border-top: 1px solid #cad4db;
  color: #2196f3;
  font-size: 16px;
  font-weight: 500;
  border-radius: 0 0 3px 3px;
  &:focus {
    outline: none;
  }
`
