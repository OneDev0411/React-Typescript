import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { primary, borderColor } from 'views/utils/colors'
import IconButton from 'components/Button/IconButton'

export const Container = styled(Flex)`
  width: 2.5rem;
  height: 2.25rem;
`

const getButtonColors = (type, props) => {
  if (props.disabled) {
    return borderColor
  }

  if (!props.checked) {
    if (type === 'border') {
      return borderColor
    }

    return '#fff'
  }

  return primary
}

export const Button = styled(IconButton)`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 8px;
  justify-content: center;
  background-color: ${props => getButtonColors('bgc', props)};
  border: solid 1px ${props => getButtonColors('border', props)};
`
