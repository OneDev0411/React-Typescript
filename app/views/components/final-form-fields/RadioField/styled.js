import styled from 'styled-components'

import { primary, borderColor, grey } from 'views/utils/colors'

export const Radio = styled.label`
  display: flex;
  align-items: center;
  font-weight: normal;
`

export const Icon = styled.i`
  width: 1.25rem;
  height: 1.25rem;
  background: #fff;
  border-radius: 100%;
  border-style: solid;
  border-width: 1px;
  border-color: ${borderColor};

  &:hover {
    background: ${grey.A125};
  }
`

export const Input = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;

  &:checked + ${Icon} {
    border-width: 0.4rem;
    border-color: ${primary};
  }
`

export const Label = styled.span`
  margin-left: 0.5rem;
`
