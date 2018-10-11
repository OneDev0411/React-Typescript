import styled from 'styled-components'

import { propTypes, defaultProps, getAppearance } from '../ActionButton'

const Button = styled.a(getAppearance)

export default Object.assign(Button, {
  propTypes,
  defaultProps,
  displayName: 'AButton'
})
