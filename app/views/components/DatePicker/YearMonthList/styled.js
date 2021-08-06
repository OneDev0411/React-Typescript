import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  border-bottom: none !important;
  text-align: left !important;
  padding-left: 0 !important;
  height: unset !important;
  margin: ${({ theme }) => theme.spacing(0.5, 2)};
`
