import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grey, primary } from '../../../../utils/colors'
import IconSearchBase from '../../../SvgIcons/Search/IconSearch'

const Container = styled.div`
  border-radius: 4px;
  background-color: ${({ isFocused }) => (isFocused ? '#ffffff' : '#f9f9f9')};
  border: solid 1px ${({ isFocused }) => (isFocused ? primary : '#d4d4d4')};
  :hover {
    background-color: ${({ isFocused }) => (isFocused ? '#ffffff' : grey.A100)};
  }
`

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 1em 0 2.5em;
  border-radius: 3px;
  border: solid 1px #d4d4d4;
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
          size={24}
          style={{
            position: 'absolute',
            top: '13px',
            left: '13px',
            width: '24px',
            height: '24px'
          }}
        />
      </Container>
    )
  }
}

SearchInput.propTypes = propTypes

export default SearchInput
