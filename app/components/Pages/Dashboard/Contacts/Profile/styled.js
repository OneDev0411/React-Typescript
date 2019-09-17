import styled from 'styled-components'

import { brandBackground } from '../../../../../views/utils/colors'

const sidebarMaxWidth = {
  tablet: '25rem', // 400
  desktop: '30rem' // 480
}

export const PageWrapper = styled.div`
  background-color: ${brandBackground};
`

export const PageContainer = styled.div`
  /* 1024px */
  @media (min-width: 64em) {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }
`

export const SideColumn = styled.div`
  @media (min-width: 64em) {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    width: ${sidebarMaxWidth.tablet};
  }

  /* 1200px */
  @media (min-width: 75em) {
    width: ${sidebarMaxWidth.desktop};
  }
`

export const MainColumn = styled.div`
  background-color: #fff;

  @media (min-width: 64em) {
    overflow-x: hidden;
    overflow-y: auto;
    width: ${`calc(100% - ${sidebarMaxWidth.tablet})`};
  }

  @media (min-width: 75em) {
    width: ${`calc(100% - ${sidebarMaxWidth.desktop})`};
  }
`

export const Card = styled.div`
  margin-bottom: 1em;
`
