import styled, { css } from 'styled-components'

import { primary, grey } from 'views/utils/colors'

import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const TreeViewNodeContainer = styled.div<{ selectable?: boolean }>`
  display: flex;
  align-items: center;
  line-height: 2.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 2rem;
  font-weight: 500;

  ${({ selectable }) =>
    selectable &&
    css`
      &:hover {
        border-radius: 0.2rem;
        background: ${grey.A250};
      }
    `}
`

type Props = { expanded?: boolean }

export const TreeViewExpandButton = styled.button`
  background: none;
  width: 2rem;
  height: 2.5rem;
  padding: 0;
  line-height: 0;
  margin-right: 0.2rem;
  border: none;
  margin-left: -2rem;

  outline: none;
  color: ${grey.A900};
  :hover {
    color: ${primary};
    background: ${grey.A300};
  }
  :focus {
    color: ${primary};
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
