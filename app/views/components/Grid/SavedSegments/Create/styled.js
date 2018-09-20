import styled from 'styled-components'

import { blue } from '../../../../utils/colors'

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 12px;
  cursor: pointer;
`

export const ItemTitle = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: #000;
  margin-left: 16px;
`

export const TextInput = styled.input`
  width: 300px;
  height: 35px;
  margin-left: 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px ${blue.A100};
  padding: 0 15px;
`
