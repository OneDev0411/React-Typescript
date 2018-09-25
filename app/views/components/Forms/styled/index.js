import styled from 'styled-components'

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid #dce5eb;
  padding: 4px 10px;
  text-align: left;
`

export const InputLabel = styled.label`
  font-weight: 400;
  font-size: 13px;
  color: ${props => (props.hasError ? 'red' : '#26465e')};
  font-weight: ${props => (props.hasError ? '500' : 'normal')};
`

export const InputError = styled.span`
  color: #fe3824;
  font-size: 13px;
  margin-top: 8px;
`

export const InputRequired = InputError.extend`
  font-size: 15px;
`
