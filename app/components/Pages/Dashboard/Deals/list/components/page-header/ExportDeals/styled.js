import styled from 'styled-components'
import ArrowDown from '../../../../../../../../views/components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const DealsDownloadButton = styled.div`
  cursor: pointer;
  height: 30px;
  display: flex;
  align-items: center;
  color: #2196f3;
  border-radius: 4px;
  border: solid 1px #2196f3;
  padding-left: 12px;
  margin-right: 16px;

  &:hover {
    color: #2196f3;
    background-color: #f0f4f7;
  }
  svg {
    margin-right: 5px;
  }
`

export const DropdownItem = styled.a`
  display: block;
  padding: 3px 20px;
  clear: both;
  font-weight: normal;
  line-height: 1.42857;
  color: #333333;
  white-space: nowrap;
  padding-top: 6px;
  padding-bottom: 6px;
  &:hover,
  &:focus {
    /* border-color: #96c8da; */
    /* box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15); */
    color: initial;
    text-decoration: none;
    background-color: lightgray;
  }
`
export const DropdownItemSub = styled.span`
  color: gray;
`

export const Icon = ArrowDown.extend`
  width: 2em;
  height: 2em;
  fill: #8da2b5;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'initial')};
`
