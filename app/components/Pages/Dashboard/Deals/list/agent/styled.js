import styled from 'styled-components'
import { Content } from '../../../../../../views/components/SlideMenu'

export const GridContainer = styled.div`
  min-height: calc(100vh - 56px);
  max-height: calc(100vh - 56px);
  overflow: auto;
`

export const PageContent = Content.extend`
  overflow: hidden;
`
