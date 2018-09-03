import styled from 'styled-components'

import { Container } from '../../../../../../../views/components/SlideMenu'

function getContainerHeight(isTrainingAccount) {
  return isTrainingAccount
    ? 'calc(100vh - (56px + 4rem + 48px))'
    : 'calc(100vh - 56px - 4rem)'
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
  padding: 1rem 0;
`

export const GridContainer = styled.div`
  min-height: ${props => getContainerHeight(props.isTrainingAccount)};
  max-height: ${props => getContainerHeight(props.isTrainingAccount)};
  overflow: auto;
  padding: 0 1.5rem;
`

export const SearchContainer = styled.div`
  margin-bottom: 3rem;
`
