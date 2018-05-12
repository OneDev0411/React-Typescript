import React from 'react'
import styled from 'styled-components'

import SearchIcon from '../../SvgIcons/Search/IconSearch'

const Container = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  border: 1px solid #cecece;
`

const Input = styled.input`
  height: 100%;
  width: 100%;
  padding: 0 0.5em;
  border: none;
  background: transparent;

  &:focus {
    outline: none;
  }
`

export const SearchInput = props => (
  <Container>
    {!props.value && <SearchIcon style={{ marginLeft: '8px', fill: '#777' }} />}
    <Input {...props} />
  </Container>
)
