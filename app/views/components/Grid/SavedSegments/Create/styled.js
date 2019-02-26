import styled from 'styled-components'

import { primary, borderColor } from '../../../../utils/colors'

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5em;
  cursor: pointer;
`

export const ItemTitle = styled.span`
  font-weight: 400;
  color: #000;
`

export const TextInput = styled.input`
  width: 300px;
  height: 2.5rem;
  margin-left: 1em;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px ${borderColor};
  padding: 0 1em;

  :focus {
    outline: none;
    border-color: ${primary};
  }
`
