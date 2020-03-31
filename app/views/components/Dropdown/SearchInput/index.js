import React from 'react'
import styled from 'styled-components'

import SearchIcon from '../../SvgIcons/Search/IconSearch'
import { grey, primary } from '../../../utils/colors'

const Container = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border: solid 1px ${grey.A300};

  :hover {
    background-color: ${grey.A100};
  }

  :focus-within {
    background-color: #ffff;
    border-color: ${primary};

    :hover {
      background-color: #fff;
    }
  }
`

const Input = styled.input`
  height: 100%;
  width: 100%;
  padding: 0 0.5em;
  border: none;
  background: transparent;
  caret-color: ${primary};
  ::placeholder {
    font-size: 1rem;
    font-weight: 400;
    color: ${grey.A900};
    font-family: LatoRegular, sans-serif;
  }
  :focus {
    outline: none;
  }

  ${Container}:hover & {
    ::placeholder {
      color: #000000;
    }
  }
`

export const SearchInput = props => (
  <Container>
    <SearchIcon style={{ marginLeft: '8px', fill: '#777' }} />
    <Input {...props} />
  </Container>
)
