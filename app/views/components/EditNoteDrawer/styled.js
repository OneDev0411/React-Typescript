import styled from 'styled-components'

import { grey } from '../../utils/colors'

export const Container = styled.div`
  height: calc(100vh - 9rem);
  overflow: auto;
  margin: 0 -1.5rem;
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
  padding: 1.5rem;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${grey.A550};
  }
`
