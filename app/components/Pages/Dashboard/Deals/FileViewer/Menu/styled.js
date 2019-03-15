import styled from 'styled-components'

import { borderColor } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  position: sticky;
  top: 0;
  background-color: #f2f2f2;
  z-index: 1;
`

export const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.25;
  color: #000;
`

export const Divider = styled.div`
  display: inline-flex;
  width: 1px;
  height: 1.5rem;
  margin: 0 1em;
  background-color: ${borderColor};
`

export const Actions = styled.div``
