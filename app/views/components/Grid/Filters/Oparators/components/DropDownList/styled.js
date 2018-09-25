import styled, { css } from 'styled-components'

import { blue, grey, primary } from '../../../../../../utils/colors'
import Card from '../../../../../Card'

export const List = Card.extend`
  position: absolute;
  top: calc(100% + 8px);
  overflow: auto;
  left: 0;
  width: 300px;
  min-height: 32px;
  max-height: 300px;
  z-index: 1001;
`

export const SelectedItem = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  margin: 0 4px 0 4px;
  padding: 0 4px;
  font-size: 14px;
  line-height: 24px;
  border-radius: 3px;
  color: #fff;
  background-color: ${primary};

  &:hover {
    background-color: ${blue.A200};
  }
`

export const ItemsContainer = styled.div`
  padding: ${props => (props.selectedItems.length > 1 ? '0.5em' : 0)};
  border-radius: 3px;
  background-color: ${grey.A200};
`

export const InputContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  border: solid 1px ${grey.A300};
  min-height: 40px;
  cursor: pointer;
  margin: ${props => (props.withMargin ? '2px 4px' : '0')};
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
  height: 38px;
  padding: 0 32px 0 8px;
  border: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`
