import styled from 'styled-components'

import { grey } from 'views/utils/colors'

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${grey.A100};
  padding: 0 0.5rem;
`

export const Body = styled.div`
  padding: 0.5rem;
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  background-color: ${grey.A100};
`

export const OfficeTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${grey.A100};
`
