import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey, placeholderColor } from 'views/utils/colors'

export const SearchInputContainer = styled.div`
  position: relative;

  & svg {
    position: absolute;
    left: ${props => props.textLength * 8.5}px;
    top: 11px;
    font-size: 10px;
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 0.25rem;
  }
`

export const SearchInput = styled.input`
  width: 250px;
  height: 40px;
  border: none;

  ::placeholder {
    color: ${placeholderColor};
  }
  :focus {
    outline: none;
  }
`

export const SearchResultsContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  min-width: 300px;
  max-height: 300px;
  overflow: auto;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  z-index: 2;
`

export const RowContainer = styled(Flex)`
  display: flex;
  padding: 0.5em 1rem;
  background-color: #fff;

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
`

export const IconContainer = styled(Flex)`
  width: 2.5rem;
  height: 2.5rem;
  background-color: #000;
  border-radius: 50%;
  > svg {
    height: 1rem;
    width: 1rem;
    fill: #ffffff;
  }
`

export const Title = styled.div`
  padding: 0.5em 1em 0.5em 1em;
  color: ${grey.A900};
  font-weight: 600;
  display: flex;
  align-items: center;

  & svg {
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 0.25rem;
  }
`

export const SectionSeparator = styled.div`
  border-bottom: 1px solid #dce5eb;
  margin: 0 1rem;
`
