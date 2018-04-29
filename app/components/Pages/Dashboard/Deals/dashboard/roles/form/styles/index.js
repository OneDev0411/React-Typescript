import styled from 'styled-components'
import './role-form.scss'

export const FormContainer = styled.form`
  padding: 0;
`

export const InputField = styled.input`
  border: none;
  font-size: 16px;
  width: 100%;
  ::placeholder {
    color: #cad4db;
    opacity: 1;
  }

  :focus {
    outline: none;
  }
`

export const InputRadio = InputField.extend`
  width: auto;
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid #dce5eb;
  padding: 4px 10px;
`

export const InputLabel = styled.label`
  color: #26465e;
  font-weight: 400;
  font-size: 13px;
`

export const InputError = styled.span`
  color: #fe3824;
  font-size: 13px;
  margin-top: 8px;
`

export const InputRequired = InputError.extend`
  font-size: 15px;
`

export const CommissionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
`

export const CommissionRadioContainer = styled.div`
  width: 120px;
  border-right: 1px solid #dce5eb;
  padding-bottom: 5px;
`

export const CommissionInputContainer = styled.div`
  width: calc(100% - 120px);
  padding: 0 10px;
`

export const RadioLabel = styled.label`
  margin: 0 6px;
  font-size: 14px;
  font-weight: 400;
`

export const AutoCompleteInputContainer = styled.div`
  position: relative;
`

export const AutoCompleteInputOptions = styled.div`
  position: absolute;
  top: 90%;
  left: 0.75rem;
  z-index: 1;
  max-height: 100px;
  overflow-y: auto;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
`

export const AutoCompleteInputItem = styled.div`
  display: block;
  padding: 0.8rem 1.1rem;
  line-height: 1em;
  font-size: 1.5rem;
  font-weight: ${props => (props.isSelected ? '500' : 'normal')};
  text-transform: none;
  white-space: normal;
  word-wrap: normal;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.87);
  background-color: ${props => (props.isActive ? 'lightgrey' : 'white')};
`
