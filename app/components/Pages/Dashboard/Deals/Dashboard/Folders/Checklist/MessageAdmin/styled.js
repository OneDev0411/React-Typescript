import styled from 'styled-components'

import { red } from 'views/utils/colors'

export const Container = styled.div`
  position: relative;
`

export const BadgeCounter = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${red.A100};
  top: -6px;
  right: -6px;
  font-size: 13px;
  color: #fff;
  border-radius: 100%;
  padding: 0 3px;
  min-width: 1.3rem;
  min-height: 1.3rem;
`
