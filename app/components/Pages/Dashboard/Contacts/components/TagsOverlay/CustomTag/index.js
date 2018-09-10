import React from 'react'
import styled from 'styled-components'
import TagIcon from '../../../../../../../views/components/SvgIcons/Tag/TagIcon'
import { primary } from 'views/utils/colors'

const borderColor = (inputFocused, error) => {
  /* inputFocused ? '#2196f3' : '#d4dfe6' */
  if (error) {
    return 'red'
  } else if (inputFocused) {
    return primary
  }

  return borderColor
}

const Container = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px;
  border-color: ${({ inputFocused, error }) =>
    borderColor(inputFocused, error)};
`

const Input = styled.input`
  width: 100%;
  margin-left: 12px;
  font-size: 1.5rem;
  border-width: 0;
  caret-color: ${primary};
  :focus {
    outline: none;
  }
`

const AddButton = styled.button`
  padding: 0;
  border-width: 0;
  background: transparent;
  font-size: 16px;
  line-height: normal;
  margin-right: 16px;
  color: ${({ inputFocused, disabled }) =>
    !disabled && inputFocused ? primary : '#8da2b5'};
  font-weight: ${({ inputFocused }) => (inputFocused ? 'bold' : 'normal')};

  &:focus {
    outline-width: 2px;
  }
`
export default class CustomTag extends React.Component {
  state = { inputFocused: false, error: false }

  shouldComponentUpdate(nextProps, nextStates) {
    return (
      nextStates.inputFocused !== this.state.inputFocused ||
      nextStates.error !== this.state.error ||
      nextProps.inputValue !== this.props.inputValue
    )
  }

  onFocus = () => {
    this.setState({ inputFocused: true })
  }

  onBlur = () => {
    this.setState({ inputFocused: false })
  }
  onChange = event => {
    const inputValue = event.target.value

    this.props.newTagChange(inputValue)
    this.setState({ error: inputValue.length > 28 })
  }

  render() {
    const { inputFocused, error } = this.state
    const { inputValue } = this.props

    return (
      <Container
        inputFocused={inputFocused}
        onSubmit={this.props.onUpsert}
        error={error}
      >
        <TagIcon style={{ marginLeft: '1em' }} />
        <Input
          value={inputValue}
          type="text"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          placeholder="Type in custom tag here…"
        />
        <AddButton
          inputFocused={inputFocused}
          type="submit"
          disabled={error || !/\S/.test(inputValue)}
        >
          Add
        </AddButton>
      </Container>
    )
  }
}
