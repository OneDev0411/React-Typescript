import styled from 'styled-components'

export const Container = styled.div`
  padding: 10px !important;
  overflow: auto;
  max-height: 380px;
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

export const SearchOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0 0 5px 5px;
`
