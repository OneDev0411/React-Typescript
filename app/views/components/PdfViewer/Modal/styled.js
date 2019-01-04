import styled from 'styled-components'
import { H3 } from 'components/Typography/headings'

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 1;
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
