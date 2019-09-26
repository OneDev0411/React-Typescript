import styled from 'styled-components'

<<<<<<< HEAD:app/views/components/SlideMenu/Content/styled.ts
interface ContainerProps {
  isSideMenuOpen: boolean
  menuWidth: React.CSSProperties['width']
}

export const Container = styled.div<ContainerProps>`
=======
interface Props {
  isSideMenuOpen: boolean
  menuWidth: string
}

export const Container = styled.div<Props>`
>>>>>>> #3374 feat(website): finalize ui of websites manager:app/views/components/SlideMenu/Content/styled.ts
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
