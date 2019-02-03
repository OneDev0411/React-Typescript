import styled from 'styled-components'

import { red, primary } from 'views/utils/colors'

export const Container = styled.div`
  position: relative;
  margin-right: 0.25rem;
  cursor: pointer;

  :hover {
    svg > path {
      fill: ${primary};
    }
  }
`

export const BadgeCounter = styled.div`
  position: absolute;
  background: ${red.A100};
  top: -3px;
  right: -3px;
  font-size: 10px;
  color: #fff;
  border-radius: 4px;
  padding: 0 3px;
  border: 2px solid #fff;
`
