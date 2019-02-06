import styled from 'styled-components'

import IconButton from 'components/Button/IconButton'

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
    border-bottom-color: ${primary};
  }

  &::placeholder {
    color: ${grey.A550};
  }
`

export const Button = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  width: 1.5rem;
  height: 1.5rem;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};

  > svg {
    fill: ${({ isOpen }) => (isOpen ? primary : '#000')};
  }
`
