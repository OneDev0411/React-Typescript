import styled from 'styled-components'

import ActionButton from 'components/Button/ActionButton'

import { borderColor, primary, grey } from 'views/utils/colors'

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5em;
  font-size: 0.875rem;
  line-height: 1.5;
  font-weight: normal;
  cursor: pointer;
  color: ${grey.A900};
`

export const Input = styled.input`
  display: block;
  width: 100%;
  margin-bottom: 1.5em;
  padding: 0 0 0.5em;
  border: none;
  border-bottom: 1px solid ${borderColor};

  &:focus {
    outline: none;
    border-bottom-color: #000;
  }

  &::placeholder {
    color: ${grey.A550};
  }
`

export const SelectButton = styled(ActionButton)`
  width: 100%;
  padding: 0;
  justify-content: space-between;
  border-bottom: 1px solid ${borderColor};
  color: ${({ isOpen }) => (isOpen ? primary : '#000')};

  &:focus {
    outline: none;
    border-bottom-color: #000;
  }

  :hover {
    > svg {
      fill: ${primary};
    }
  }
`
