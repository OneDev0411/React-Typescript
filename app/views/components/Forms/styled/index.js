import styled from 'styled-components'

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid #dce5eb;
  padding: 0.5rem 0;
  text-align: left;
`

export const InputLabel = styled.label`
  font-weight: 400;
  font-size: 1rem;
  color: ${props => (props.hasError ? 'red' : '#7f7f7f')};
  font-weight: ${props => (props.hasError ? '500' : 'normal')};
`

export const InputError = styled.span`
  color: #fe3824;
  font-size: 13px;
  margin-top: 8px;
`

export const InputRequired = styled(InputError)`
  font-size: 15px;
`
