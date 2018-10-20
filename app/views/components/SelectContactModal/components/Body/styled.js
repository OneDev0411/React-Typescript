import styled, { css } from 'styled-components'

export const ListContainer = styled.div`
  position: relative;
  height: calc(100vh - ${props => (props.isDrawer ? 10.5 : 10.75)}rem);
  padding: ${props => (props.isDrawer ? 0 : '1.5rem 0')};
  overflow-x: hidden;

  ${props =>
    !props.isDrawer
      ? css`
          @media screen and (min-width: 48em) {
            height: 15rem;
          }
        `
      : ''};
`

export const List = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding-bottom: ${props => (props.isDrawer ? '1.5rem' : 0)};
`
