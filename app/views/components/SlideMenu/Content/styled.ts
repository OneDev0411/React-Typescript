import styled from 'styled-components'

interface ContainerProps {
  isSideMenuOpen: boolean
  menuWidth: React.CSSProperties['width']
}

export const Container = styled.div<ContainerProps>`
  width: ${props =>
    !props.isSideMenuOpen ? '100%' : `calc(100% - ${props.menuWidth})`};
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;

  // to prevent any possible side-menu overflow to be visible when the side-menu
  // is closed
  z-index: 1;

  box-shadow: -1px 0 2px 0 rgba(0, 0, 0, 0.04), -1px 0 20px 0 rgba(0, 0, 0, 0.1);
`
