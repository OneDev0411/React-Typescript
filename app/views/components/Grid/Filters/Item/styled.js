import styled from 'styled-components'
import Flex from 'styled-flex-component'

import Card from 'components/Card'
import { grey, red } from 'views/utils/colors'

import Button from 'components/Button/ActionButton'
import IconButton from 'components/Button/IconButton'

function getItemColor(props) {
  if (props.isIncomplete && !props.isActive) {
    return red.A100
  }

  return '#000'
}

export const RemoveButton = IconButton.extend`
  visibility: hidden;
  margin-left: 0.5em;
  padding: 0;
`

export const Container = Flex.extend`
  position: relative;
  height: 40px;
  margin-right: 0.5em;
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
  padding: 0 1em;
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
export const DoneButton = Button.extend`
  display: block;
  width: 100%;
  text-align: center;
  border-top: 1px solid ${grey.A300};
`
