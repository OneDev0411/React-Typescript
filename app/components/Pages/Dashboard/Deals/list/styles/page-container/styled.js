import styled from 'styled-components'

import { Container } from '../../../../../../../views/components/SlideMenu'

function getContainerHeight(isTrainingAccount) {
  return isTrainingAccount
    ? 'calc(100vh - (56px + 48px))'
    : 'calc(100vh - 56px)'
}

export const PageContainer = Container.extend`
  ${props =>
    props.isTrainingAccount &&
    `
    min-height: calc(100vh - 48px);
    max-height: calc(100vh - 48px);
  `};
`

export const PageContent = styled.div`
  width: 100%;
  overflow: hidden;
`

export const GridContainer = styled.div`
  min-height: ${props => getContainerHeight(props.isTrainingAccount)};
  max-height: ${props => getContainerHeight(props.isTrainingAccount)};
  overflow: auto;
  padding: 40px;
`

export const SearchContainer = styled.div`
  margin-bottom: 40px;
`
