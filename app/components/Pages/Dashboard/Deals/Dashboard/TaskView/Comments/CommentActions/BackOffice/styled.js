import styled from 'styled-components'
import IconButton from 'components/Button/IconButton'

function getBorderColor(props, isHovered = false) {
  if (!props.isActive && isHovered === false) {
    return '#c9d7df'
  }

  switch (props.button) {
    case 'approve':
      return '#35b863'
    case 'decline':
      return '#d0021b'
    case 'reset':
      return '#f5a623'
  }
}

function getBackgroundColor(props, isHovered = false) {
  if (!props.isActive && isHovered === false) {
    return '#fff'
  }

  switch (props.button) {
    case 'approve':
      return '#35b863'
    case 'decline':
      return '#d0021b'
    case 'reset':
      return '#f5a623'
  }
}

export const StatusButton = styled(IconButton)`
  border: solid 1px #c9d7df;

  border-color: ${props => getBorderColor(props)};
  background-color: ${props => getBackgroundColor(props)};

  svg {
    fill: ${props => (props.isActive ? '#fff' : '#c9d7df')};
  }

  :hover {
    svg {
      fill: #fff;
    }

    border-color: ${props => getBorderColor(props, true)};
    background-color: ${props => getBorderColor(props, true)};
  }
`

export const Loading = styled.div`
  display: inline-block;
`
