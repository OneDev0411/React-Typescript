import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import IconSearchBase from '../../../../SvgIcons/Search/IconSearch'
import { grey, primary } from '../../../../../utils/colors'

const Container = styled.div`
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border: solid 1px ${grey.A300};
  padding: 0 0.5rem;
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
  width: 100%;
  height: 42px;
  padding: 0 0.5em;
  border: none;

  background: transparent;
  caret-color: ${primary};
  ::placeholder {
    font-size: 1rem;
    font-weight: 500;
    color: ${grey.A900};
    font-family: Barlow, sans-serif;
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

const IconSearch = IconSearchBase.extend`
  path {
    fill: ${grey.A900} !important;
  }
  ${Container}:hover & path {
    fill: #000000 !important;
  }
`

const propTypes = {
  style: PropTypes.object,
  inputProps: PropTypes.object.isRequired
}

function SearchInput({ style, inputProps }) {
  return (
    <Container style={{ ...style }}>
      <IconSearch />
      <Input {...inputProps} />
    </Container>
  )
}

SearchInput.propTypes = propTypes

export default SearchInput
