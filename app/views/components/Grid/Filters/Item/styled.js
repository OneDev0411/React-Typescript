import styled from 'styled-components'

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

export const RemoveButton = styled(IconButton)`
  height: 1.5em;
  margin-left: 0.5em;
  padding: 0;
`

export const ItemTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
`

export const Container = styled.div`
  display: inline-flex;
  position: relative;
  margin-right: 0.5em;
  border-radius: 100px;
  border: solid 1px ${props => (props.isActive ? '#000' : grey.A100)};
  cursor: pointer;

  ${ItemTitle} {
    color: ${props => getItemColor(props, '#000')};
  }

  &:hover {
    background-color: #fff;
    border: solid 1px ${props => getItemColor(props)};
  }

  &:hover ${RemoveButton} svg {
    fill: ${grey.A900};
  }
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.5em;
`

export const Menu = styled(Card)`
  position: absolute;
  top: 48px;
  left: 0;
  z-index: 1000;
  min-width: 12rem;
`

export const Content = styled.div`
  cursor: auto;
`
export const DoneButton = styled(Button)`
  display: block;
  width: 100%;
  text-align: center;
  border-top: 1px solid ${grey.A300};
`
