import styled, { css } from 'styled-components'

import { primary, grey } from 'views/utils/colors'

import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const TreeViewNodeContainer = styled.div<{ selectable?: boolean }>`
  display: flex;
  align-items: center;
  line-height: 2.2;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 2rem;
  font-weight: 500;

  ${({ selectable }) =>
    selectable &&
    css`
      &:hover {
        border-radius: 0.2rem;
        background: #fff;
      }
    `}
`

type Props = { expanded?: boolean }

export const TreeViewExpandButton = styled.button`
  background: none;
  width: auto;
  height: auto;
  padding: 0;
  line-height: 0;
  border-radius: 50%;
  margin-right: 0.2rem;
  border: none;
  margin-left: -1.75rem;

  outline: none;
  color: ${grey.A900};
  :hover,
  :focus {
    color: ${primary};
  }
  :focus {
    background: ${`${primary}12`};
  }
`
export const TreeViewExpandArrow = styled(IconKeyboardArrowDown)<Props>`
  transition: transform 0.2s;
  fill: currentColor;
  padding-top: 0.15rem;
  flex-shrink: 0;

  ${({ expanded }) =>
    !expanded &&
    css`
      transform: rotateZ(-90deg);
    `}
`

export const TreeViewNodeChildrenContainer = styled.div`
  padding-left: 1.7rem;
`
