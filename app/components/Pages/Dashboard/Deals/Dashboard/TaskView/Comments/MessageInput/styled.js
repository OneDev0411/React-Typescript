import styled from 'styled-components'
import AutoTextarea from 'react-textarea-autosize'

export const Container = styled.div`
  min-height: 107px;
  margin: 3px 1.5rem 0 1.5rem;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
`

export const Actions = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 1rem;

  button {
    margin-left: 1rem;
  }
`

export const Textarea = styled(AutoTextarea)`
  padding: 8px;
  resize: none;
  border-radius: 3px;
  background-color: #f9f9f9;
  border: solid 1px #d4d4d4;
  transition: 0.2s ease-in all;

  :focus {
    outline: none;
  }
`

export const Devider = styled.div`
  border-bottom: solid 1px #d4d4d4;
  margin: 1rem 0;
`
