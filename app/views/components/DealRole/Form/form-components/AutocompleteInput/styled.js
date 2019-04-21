import styled from 'styled-components'

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
