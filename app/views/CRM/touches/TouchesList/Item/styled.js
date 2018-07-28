import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  padding: 0 1em 1em;
  margin-bottom: 1em;
  border-bottom: 1px solid #ecf1f5;

  &:last-child {
    margin-bottom: 0;
    border-bottom-width: 0;
  }
`
