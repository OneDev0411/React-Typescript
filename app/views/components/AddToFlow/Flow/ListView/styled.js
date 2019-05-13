import styled from 'styled-components'

export const Container = styled.div`
  width: 50%;
  overflow-y: auto;
  background: #f7f7f7;
`

export const EmptyContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`
