import styled from 'styled-components'

import { borderColor } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  height: 97px;
  border-bottom: 1px solid #d4d4d4;
  padding: 1.5rem 2.5rem;
  border-bottom: 1px solid #ddd;
`

export const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`

export const Divider = styled.div`
  display: inline-flex;
  width: 1px;
  height: 1.5rem;
  margin: 0 0.825em;
  background-color: ${borderColor};
`
