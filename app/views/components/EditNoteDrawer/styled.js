import styled from 'styled-components'

import { grey } from '../../utils/colors'

export const Container = styled.div`
  height: calc(100vh - (56px + 63px + 32px));
  overflow: auto;
`

export const Input = styled.textarea`
  width: 100%;
  height: inherit;
  padding: 1.5rem 0;
  display: block;
  overflow: auto;
  resize: none;
  border: none;
  font-size: 1.5rem;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${grey.A550};
  }
`

export const ErrorMessage = styled.div`
  padding: 1rem;
  font-size: 0.875rem;
  border-radius: 3px;
  margin: 0 1rem;
  background: rgba(255, 0, 0, 0.05);
  border-color: rgba(255, 0, 0, 0.2);
  color: rgba(255, 0, 0, 0.8);
`
