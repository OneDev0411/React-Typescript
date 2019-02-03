import styled from 'styled-components'

import { red } from 'views/utils/colors'

export const Container = styled.div`
  position: relative;
  margin-right: 0.25rem;
  cursor: pointer;

  svg {
    fill: #d1d1d1;
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
