import styled from 'styled-components'

import { itemHeight, minItemHeight } from '../variables'

export const SideNavItem = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: ${itemHeight}px;
  max-height: ${itemHeight}px;
  min-height: ${minItemHeight}px;
  cursor: pointer;
  transition: background-color 0.2s ease-in;
`
