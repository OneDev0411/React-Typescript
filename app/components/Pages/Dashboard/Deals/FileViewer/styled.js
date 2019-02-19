import styled, { css } from 'styled-components'

import {
  Container,
  Menu,
  Content
} from '../../../../../views/components/SlideMenu'

export const LayoutContainer = styled.div`
  padding: 2rem;
  background-color: #f2f2f2;
  box-shadow: -1px 0 2px 0 rgba(0, 0, 0, 0.04), -1px 0 20px 0 rgba(0, 0, 0, 0.1);
`

export const PageContainer = styled(Container)`
  background-color: transparent;
  box-shadow: none;
  max-height: none;
`

export const SideMenu = styled(Menu)`
  margin-right: 1rem;
  padding: 0;
  height: auto;
  overflow-x: initial;

  ${props =>
    props.isOpen === false &&
    css`
      margin: 0;
    `};
`

export const PageContent = styled(Content)`
  box-shadow: none;
  border-radius: 3px;
  border: solid 1px #d4d4d4;
  background-color: #fafafa;
  text-align: center;
  max-height: none;
`
