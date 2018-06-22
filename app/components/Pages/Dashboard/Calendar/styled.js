import styled from 'styled-components'
import { Content } from '../../../../views/components/SlideMenu'

export const PageContent = Content.extend`
  overflow: hidden;
`

export const MenuContainer = styled.div`
  padding: 5px;

  &:focus {
    outline: none !important;
  }
`

export const CalendarContent = styled.div`
  position: relative;
`

export const HeroTitle = styled.div`
  height: 50px;
  font-size: 30px;
  font-weight: bold;
  color: #17283a;
  padding: 0 15px 15px 15px;
  border-bottom: 1px solid #dce5eb;
`
