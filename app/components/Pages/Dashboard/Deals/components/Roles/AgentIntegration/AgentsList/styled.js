import styled from 'styled-components'

export const Container = styled.div`
  padding: 1rem 0;
  overflow: auto;
`

export const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  margin-bottom: 10px;
  padding: 0 10px;

  :focus {
    outline: none;
  }
`

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  font-weight: 500;
  font-size: 16px;
`
