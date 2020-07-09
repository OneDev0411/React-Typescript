import styled from 'styled-components'

import Card from 'components/Card'
import ActionButton from 'components/Button/ActionButton'

import { borderColor, primary, grey } from 'views/utils/colors'

export const Container = styled.div`
  @media screen and (min-width: 48em) {
    margin-right: 1.5rem;
    width: ${({ width }) => (width ? `${width}%` : '20%')};

    &:last-child {
      margin-right: 0;
    }
  }
`

export const Label = styled.label`
  display: Flex;
  align-items: center;
  margin-bottom: 0.5em;
  font-size: 0.875rem;
  line-height: 1.5;
  font-weight: normal;
  cursor: pointer;
  color: ${grey.A900};
`

export const Hint = styled.span`
  height: 1rem;
  width: 1rem;
  margin-left: 0.5em;

  svg {
    color: ${primary};
  }
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
  height: auto;
  line-height: 1;
  padding: 0 0 0.5rem;
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

export const List = styled(Card)`
  width: 100%;
  position: absolute;
  top: calc(100% - 1rem);
  left: 0;
  z-index: 3;
  overflow-y: auto;
  max-height: 10rem;
`
