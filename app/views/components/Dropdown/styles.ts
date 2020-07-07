import styled from 'styled-components'

import ActionButton from '../Button/ActionButton'

export const Button = styled(ActionButton)<{ fullWidth?: boolean }>`
  position: relative;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  display: flex;
  align-items: center;
  justify-content: ${props => (props.fullWidth ? 'space-between' : 'initial')};
  font-weight: normal;
`
