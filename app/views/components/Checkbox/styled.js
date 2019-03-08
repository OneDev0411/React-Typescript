import styled from 'styled-components'

import { primary, grey } from '../../utils/colors'
import IconCheck from '../SvgIcons/Checkmark/IconCheckmark'

// visually hidden
export const Input = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`

export const Label = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin: ${props => props.margin};
  font-weight: normal;
  cursor: pointer;

  &:before {
    content: '';
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    margin-right: 0.5em;
    border-radius: 3px;
    background-color: ${props => (props.checked ? primary : '#fff')};
    border: solid 1px ${props => (props.checked ? primary : grey.A550)};

    &:hover {
      background-color: ${props => (props.checked ? primary : grey.A100)};
    }
  }
`

export const CheckMark = styled(IconCheck)`
  position: absolute;
  left: 0;
  top: 0.25em;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  fill: #fff;
`
