import styled from 'styled-components'

import IconButton from 'components/Button/IconButton'

function getBorderColor(props, isHovered = false) {
  if (!props.isActive && isHovered === false) {
    return '#000'
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
    return '#000'
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

  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  border-color: ${props => getBorderColor(props)};
  padding: 0;
  line-height: initial;
  justify-content: center;

  svg {
    color: ${props => (props.isActive ? getBackgroundColor(props) : '#000')};
  }

  :hover {
    svg {
      color: #fff;
    }

    border-color: ${props => getBorderColor(props, true)};
    background-color: ${props => getBorderColor(props, true)};
  }
`

export const Loading = styled.div`
  display: inline-block;
`
