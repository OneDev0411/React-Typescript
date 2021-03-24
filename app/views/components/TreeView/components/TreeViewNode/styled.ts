import { FunctionComponent } from 'react'
import styled, { StyledComponent, css } from 'styled-components'
import { FlexItem } from 'styled-flex-component'

import { primary, grey } from 'views/utils/colors'

import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const TreeViewNodeContainer = styled.div<{
  selectable?: boolean
  expandable?: boolean
}>`
  display: flex;
  align-items: center;
  line-height: 2.2;
  padding-left: 1rem;
  font-weight: 500;

  ${({ selectable }) =>
    selectable &&
    css`
      &:hover {
        border-radius: 0.2rem;
        background: ${grey.A250};
      }
    `}
  ${({ expandable }) =>
    !expandable &&
    css`
      margin-left: 1.2rem;
    `}
`

export const TreeViewNodeContent = styled(FlexItem).attrs({ grow: 1 })`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const TreeViewExpandButton = styled.button`
  background: none;
  width: 2rem;
  min-width: 2rem;
  height: 2.5rem;
  padding: 0;
  line-height: 0;
  margin-right: 0.2rem;
  border: none;
  margin-left: -1rem;

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

export const TreeViewNodeChildrenContainer = styled.div`
  padding-left: 1.4rem;
`

interface TreeViewExpandArrowProps {
  expanded?: boolean
}

export const TreeViewExpandArrow: StyledComponent<
  FunctionComponent<TreeViewExpandArrowProps>,
  TreeViewExpandArrowProps
> = styled(IconKeyboardArrowDown)`
  transition: transform 0.2s;
  fill: currentColor;
  padding-top: 0.15rem;
  flex-shrink: 0;

  ${({ expanded }: TreeViewExpandArrowProps) =>
    !expanded &&
    css`
      transform: rotateZ(-90deg);
    `}
`
