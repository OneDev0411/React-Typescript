import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import SearchIcon from '../../../SvgIcons/SearchIcon'

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 1em 0 2.5em;
  border-radius: 3px;
  border: solid 1px #d4d4d4;

  &::placeholder {
    color: #7f7f7f;
  }
`

const propTypes = {
  style: PropTypes.object,
  inputProps: PropTypes.object.isRequired
}

function SearchInput({ style, inputProps }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <Input {...inputProps} />
      <SearchIcon
        size={24}
        style={{
          position: 'absolute',
          top: '13px',
          left: '13px',
          width: '24px',
          height: '24px'
        }}
      />
    </div>
  )
}

SearchInput.propTypes = propTypes

export default SearchInput
