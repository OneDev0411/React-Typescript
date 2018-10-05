import styled from 'styled-components'
import AbstractCard from 'components/Card'

import { borderColor } from '../../../../../views/utils/colors'

export const Divider = styled.div`
  display: inline-block;
  width: 1px;
  height: 24px;
  margin: 0 1em;
  background-color: ${borderColor};
`

export const FactsheetDivider = styled.div`
  width: 3.3rem;
  height: 1px;
  margin: 1.5rem;
  background-color: ${borderColor};
`

export const Container = styled.div`
  min-height: 100vh;
  background-color: #f2f2f2;
  box-shadow: -1px 0 2px 0 rgba(0, 0, 0, 0.04), -1px 0 20px 0 rgba(0, 0, 0, 0.1);
`

export const PageContent = styled.div`
  display: flex;
  padding: 0 2.5em;
`

export const SideColumnContainer = styled.div`
  overflow: hidden;
  width: 21rem;
`

export const MainContainer = styled.div`
  flex: 1;
  margin-left: 1.5rem;
`

export const Card = styled(AbstractCard)`
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px ${borderColor};
  box-shadow: none;
`
