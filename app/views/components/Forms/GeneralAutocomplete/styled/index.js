import styled from 'styled-components'
import ArrowDropDown from '../../../SvgIcons/ArrowDropDown/IconArrowDropDown'

export const Input = styled.input`
  width: 100%;
  padding: 0;
  font-size: 1.8rem;
  border-width: 0;

  :focus {
    outline: none;
  }

  ::placeholder {
    color: #cad4db;
  }
`

export const ArrowDownIcon = ArrowDropDown.extend`
  width: 28px;
  height: 28px;
  fill: #8da2b5;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

export const List = styled.div`
  width: 100%;
  position: absolute;
  top: 90%;
  left: 0;
  z-index: 1;
  min-height: ${props => (props.fixedHeight ? '100px' : 'auto')};
  overflow-y: auto;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
`

export const Item = styled.div`
  display: block;
  padding: 0.8rem 1.1rem;
  line-height: 1em;
  font-size: 1.5rem;
  font-weight: ${props => (props.isSelected ? '500' : 'normal')};
  text-transform: none;
  white-space: normal;
  word-wrap: normal;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.87);
  background-color: ${props => (props.isActive ? 'lightgrey' : 'white')};
`
