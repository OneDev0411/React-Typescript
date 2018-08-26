import styled from 'styled-components'
import Flex from 'styled-flex-component'

import Card from 'components/Card'
import { blue, grey } from 'views/utils/colors'

import IconButton from 'components/Button/IconButton'

function getItemColor(props) {
  if (props.isIncomplete && !props.isActive) {
    return '#fd3a57'
  }

  return '#000'
}

export const RemoveButton = IconButton.extend`
  visibility: hidden;
  margin-left: 8px;
`

export const Container = Flex.extend`
  position: relative;
  height: 40px;
  margin-right: 8px;
  line-height: 38px;
  border-radius: 3px;
  background-color: ${props => (props.isActive ? '#fff' : grey.A100)};
  border: solid 1px ${props => (props.isActive ? '#000' : grey.A100)};
  cursor: pointer;

  ${ItemTitle} {
    color: ${props => getItemColor(props, '#000')};
  }

  &:hover {
    background-color: #fff;
    border: solid 1px ${props => getItemColor(props)};
  }

  &:hover ${RemoveButton} {
    visibility: visible;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-family: 'Barlow', sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
`

export const ItemTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Menu = Card.extend`
  position: absolute;
  top: 48px;
  left: 0;
  z-index: 1000;
  width: 280px;
  min-height: 190px;
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
  border-top: 1px solid ${grey.A300};
  color: ${blue.A100};
  font-size: 16px;
  font-weight: 500;
  border-radius: 0 0 3px 3px;
  &:focus {
    outline: none;
  }
`
