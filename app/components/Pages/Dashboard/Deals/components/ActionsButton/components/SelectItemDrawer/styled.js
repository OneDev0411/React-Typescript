import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 0.875rem 0;
`

export const NameContainer = styled.div`
  flex: 0.85;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const Title = styled.div`
  font-size: 1rem;
  font-weight: 400;

  :hover {
    color: ${({ theme }) => theme.palette.secondary.main};
    text-decoration: underline;
    cursor: pointer;
  }
`

export const DateTime = styled.div`
  font-size: 0.875rem;
  color: #999;
`
