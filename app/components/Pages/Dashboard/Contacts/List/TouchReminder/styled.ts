import styled from 'styled-components'

import { borderColor, primary } from 'views/utils/colors'

import IconTime from 'components/SvgIcons/Time/IconTime'

export const Container = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-right: 2.5rem;
  margin-right: 2.5rem;

  &:after {
    content: '';
    position: absolute;
    width: 1px;
    right: 0;
    height: 60%;
    background-color: ${borderColor};
  }
`

interface LabelProps {
  bold?: boolean
}

export const Label = styled.label<LabelProps>`
  font-size: 1rem;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  margin: 0;
`

export const Icon = styled(IconTime)`
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.5rem;
`

export const Input = styled.input.attrs({
  type: 'tel', // forced to use type tel in order to get selectionStart and selectionEnd
  step: '1',
  min: '0',
  max: '99999'
})`
  outline: none;
  border: none;
  border-bottom: 1px solid ${borderColor};
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  color: ${primary};
  width: 3rem;
  margin: 0 0.5rem;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`
