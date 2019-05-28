import styled from 'styled-components'

import { defaultProps, getAppearance } from '../ActionButton'

const Button = styled.a(getAppearance)

export default Object.assign(Button, {
  defaultProps,
  displayName: 'AButton'
})
