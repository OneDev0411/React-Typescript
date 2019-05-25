import styled, { css } from 'styled-components'

import { borderColor } from 'views/utils/colors'

import { Container, Menu, Content } from 'components/SlideMenu'

const menuHeight = '5rem'
export const containerHeight = `calc(100vh - ${menuHeight} - 1rem)`

export const LayoutContainer = styled.div`
  padding: 2rem;
  padding-top: 0;
  background-color: #f2f2f2;
  overflow: hidden;
  max-height: 100vh;
  box-shadow: -1px 0 2px 0 rgba(0, 0, 0, 0.04), -1px 0 20px 0 rgba(0, 0, 0, 0.1);
`

export const PageContainer = styled(Container)`
  background-color: transparent;
  box-shadow: none;
  min-height: ${containerHeight};
  max-height: ${containerHeight};
`

export const SideMenu = styled(Menu)`
  margin-right: 1rem;
  overflow: hidden;
  padding: 0;

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
  background-color: #fff;
  text-align: center;
  max-height: ${containerHeight};
  overflow: auto;
  padding-bottom: 2rem;
`

export const MenuContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${menuHeight};
  background-color: #f2f2f2;
`

export const MenuTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.25;
  color: #000;
`

export const MenuDivider = styled.div`
  display: inline-flex;
  width: 1px;
  height: 1.5rem;
  margin: 0 1em;
  background-color: ${borderColor};
`

export const EnvelopeContainer = styled.div`
  border-radius: 3px;
  border: solid 1px #d4d4d4;
  background-color: #fafafa;
  margin-left: 1rem;
  height: ${containerHeight};
  overflow: auto;
`
