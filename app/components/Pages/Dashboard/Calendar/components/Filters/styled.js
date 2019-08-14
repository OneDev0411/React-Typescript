import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  width: 85%;
  height: 100%;
  align-items: flex-end;
  margin-left: 1.5rem;
`

export const TabTitle = styled.span`
  font-size: 1rem;
  margin-left: 0.5rem;
`

export const TabItem = styled.div`
  display: flex;
  align-items: center;

  :hover {
    color: ${primary};

    svg {
      fill: ${primary};
    }
  }
`
