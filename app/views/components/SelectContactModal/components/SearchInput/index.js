import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { mdiMagnify } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { grey, primary, borderColor } from '../../../../utils/colors'

const Container = styled.div`
  border-radius: 3px;
  background-color: ${({ isFocused }) => (isFocused ? '#fff' : grey.A175)};
  border: solid 1px ${({ isFocused }) => (isFocused ? primary : borderColor)};
  :hover {
    background-color: ${({ isFocused }) => (isFocused ? '#fff' : grey.A100)};
  }
`

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 1em 0 2.5em;
  border-radius: 3px;
  border: none;
  caret-color: ${primary};
  background-color: transparent;

  ::placeholder {
    color: ${grey.A900};
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

const IconSearch = styled(SvgIcon)`
  path {
    color: ${grey.A900} !important;
  }
  ${Container}:hover & path {
    color: #000000 !important;
  }
`

const propTypes = {
  style: PropTypes.object,
  inputProps: PropTypes.object.isRequired
}

class SearchInput extends React.Component {
  state = { isFocused: false }

  onBlur = () => this.setState({ isFocused: false })

  onFocus = () => this.setState({ isFocused: true })

  render() {
    const { style, inputProps } = this.props

    return (
      <Container
        isFocused={this.state.isFocused}
        style={{ position: 'relative', ...style }}
      >
        <Input {...inputProps} onBlur={this.onBlur} onFocus={this.onFocus} />
        <IconSearch
          path={mdiMagnify}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px'
          }}
        />
      </Container>
    )
  }
}

SearchInput.propTypes = propTypes

export default SearchInput
