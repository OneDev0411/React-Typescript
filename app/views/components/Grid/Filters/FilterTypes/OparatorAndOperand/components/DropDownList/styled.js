import styled, { css } from 'styled-components'

import { grey, primary } from 'views/utils/colors'

import Card from 'components/Card'

export const List = styled(Card)`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  overflow: auto;
  width: 18.75rem;
  min-height: 2rem;
  max-height: 18.75rem;
  z-index: 1001;
`

export const ItemsContainer = styled.div`
  border-radius: 3px;
  background-color: ${grey.A200};
`

export const InputContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  border: solid 1px ${grey.A300};
  min-height: 2.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding-right: 0.5rem;
  ${props =>
    props.inputFocused &&
    css`
      border-color: ${primary};
      caret-color: ${primary};
    `};
`

export const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  padding: 0 2rem 0 0.5rem;
  border: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`
