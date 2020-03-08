import styled from 'styled-components'

import { grey } from '../../utils/colors'
import { theme } from '../../../theme'
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
  display: inline-flex;
  align-items: center;
  margin: 0;
  font-weight: normal;
  cursor: pointer;
`

interface CheckMarkBoxProps {
  size: number
  checked?: boolean
}

export const CheckMarkBox = styled.div<CheckMarkBoxProps>`
  width: ${props => props.size / 16}rem;
  height: ${props => props.size / 16}rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background-color: ${props =>
    props.checked ? theme.palette.primary.main : theme.palette.common.white};
  border: solid 1px
    ${props =>
      props.checked ? theme.palette.primary.main : theme.palette.common.black};

  &:hover {
    background-color: ${props =>
      props.checked ? theme.palette.primary.main : grey.A100};
  }
`

export const CheckMark = styled(IconCheck)`
  width: 100%;
  height: 100%;
  fill: #fff;
`
