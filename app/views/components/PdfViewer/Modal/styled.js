import styled from 'styled-components'

import { H3 } from 'components/Typography/headings'

import { appSidenavWidth } from '../../../../components/Pages/Dashboard/SideNav/variables'

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: ${appSidenavWidth}px;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 2;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d4d4d4;
  padding: 0 1rem;
  height: 5rem;
`

export const HeaderTitle = styled(H3)`
  color: #000;
`

export const ViewerContainer = styled.div`
  height: calc(100vh - 5rem);
  overflow: auto;
`
