import styled from 'styled-components'

import ActionButton from 'components/Button/ActionButton'

export const Button = styled(ActionButton)`
  &:not(:first-of-type) {
    margin-left: 0.5rem;
  }
`

export const Icon = styled.i`
  font-size: 1.5rem;
  margin: 0.5rem;
`
