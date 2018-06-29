import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import SearchIcon from '../../../SvgIcons/SearchIcon'

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 16px 0 42px;
  font-size: 1.5rem;
  color: #8da2b5;
  border-radius: 3px;
  background-color: #f0f4f7;
  border: solid 1px #dce5eb;

  &:focus {
    outline-width: 1px;
    color: #333;
    background-color: #fff;
  }

  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: #8da2b5;
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    color: #8da2b5;
  }
  :-ms-input-placeholder {
    /* IE 10+ */
    color: #8da2b5;
  }
  :-moz-placeholder {
    /* Firefox 18- */
    color: #8da2b5;
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
        color="#8DA2B5"
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
