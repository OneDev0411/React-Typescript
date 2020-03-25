import styled from 'styled-components'

export const NotifyOfficeContainer = styled.div`
  opacity: 0;
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d4d4d4;
  padding: 0.875rem 0;

  :hover ${NotifyOfficeContainer} {
    opacity: 1;
  }
`

export const Title = styled.div`
  font-size: 1rem;
  flex: 0.9;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  :hover {
    color: ${({ theme }) => theme.palette.secondary.main};
    text-decoration: underline;
    cursor: pointer;
  }
`
