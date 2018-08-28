import styled from 'styled-components'

export const SearchInputContainer = styled.div`
  position: relative;

  i {
    position: absolute;
    left: ${props => props.textLength * 8}px;
    top: 17px;
    font-size: 10px;
  }
`

export const SearchInput = styled.input`
  width: 250px;
  height: 40px;
  border: none;

  :focus {
    outline: none;
  }
`

export const SearchResults = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  min-width: 300px;
  max-height: 200px;
  overflow: auto;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
`
