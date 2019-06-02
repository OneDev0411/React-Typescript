import styled from 'styled-components'

import { red } from 'views/utils/colors'

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 0.5rem 0;
  text-align: left;
`

export const InputLabel = styled.label<{ hasError?: boolean }>`
  font-weight: 400;
  font-size: 1rem;
  color: ${props => (props.hasError ? 'red' : '#7f7f7f')};
  font-weight: ${props => (props.hasError ? '500' : 'normal')};
`

export const InputError = styled.div<{ display?: boolean }>`
  color: ${red.A100};
  font-size: 0.75rem;
  opacity: ${props => (props.display ? 1 : 0)};
`

export const InputRequired = styled.span`
  color: ${red.A100};
  font-size: 1rem;
  margin-left: 3px;
`
