import styled from 'styled-components'

export const Container = styled.div`
  width: ${props =>
    !props.isSideMenuOpen ? '100%' : `calc(100% - ${props.menuWidth})`};
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: -1px 0 2px 0 rgba(0, 0, 0, 0.04), -1px 0 20px 0 rgba(0, 0, 0, 0.1);
`
