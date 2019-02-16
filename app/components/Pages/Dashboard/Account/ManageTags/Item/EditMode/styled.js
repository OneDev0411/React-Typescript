import styled from 'styled-components'

import ActionButton from 'components/Button/ActionButton'
import { grey, primary } from 'views/utils/colors'

export const Container = styled.div``

export const ActionsContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10.25rem;
  height: 3rem;
  top: calc(100% + 0.125rem);
  left: 0;
  border: 1px solid ${grey.A300};
  border-radius: 3px;
  background-color: ${grey.A100};
  box-shadow: 0 1px 4px 0 ${grey.A100};
  z-index: 1;
`

export const Input = styled.input`
  width: 100%;
  padding: 0 0.9rem;
  border: none;
  outline: none;
  background: transparent;
`

export const CancleButton = styled(ActionButton)`
  border: none;
  color: ${primary};
`
