import styled from 'styled-components'

import { brandBackground } from '../../../../../views/utils/colors'

const sidebarMaxWidth = '25rem' // 400

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
    width: ${sidebarMaxWidth};
  }
`

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;

  @media (min-width: 64em) {
    overflow-x: hidden;
    overflow-y: auto;
    width: ${`calc(100% - ${sidebarMaxWidth})`};
  }
`

export const Card = styled.div`
  margin-bottom: 1em;
`
