import styled from 'styled-components'

import Card from 'components/Card'

function getItemColor(props) {
  if (props.isIncomplete && !props.isActive) {
    return props.theme.palette.error.main
  }

  return '#000'
}

export const ItemTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8125rem;
`

export const Container = styled.div`
  display: inline-flex;
  position: relative;
  margin-right: 0.5em;
  border-radius: 100px;
  border: solid 1px
    ${props => (props.isActive ? '#000' : props.theme.palette.grey['100'])};
  cursor: pointer;

  ${ItemTitle} {
    color: ${props => getItemColor(props, '#000')};
  }

  &:hover {
    background-color: #fff;
    border: solid 1px ${props => getItemColor(props)};
  }
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
