import styled from 'styled-components'

import { brandBackground } from 'views/utils/colors'

export const PageContainer = styled.div`
  padding: 0 1.5rem 4.5rem;
  height: auto;
  min-height: 100vh;
  background: ${brandBackground};
`

export const TabPanel = styled.div`
  display: flex;
  justify-content: center;
`
