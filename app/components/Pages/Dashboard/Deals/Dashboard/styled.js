import styled from 'styled-components'

import { borderColor } from '../../../../../views/utils/colors'

export const Divider = styled.div`
  display: inline-block;
  width: 1px;
  height: 24px;
  margin: 0 1em;
  background-color: ${borderColor};
`

export const Container = styled.div`
  min-height: 100vh;
  background-color: #f2f2f2;
  box-shadow: -1px 0 2px 0 rgba(0, 0, 0, 0.04), -1px 0 20px 0 rgba(0, 0, 0, 0.1);
  padding-bottom: 2.5rem;
`
